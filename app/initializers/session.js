import Ember from 'ember';
import DS from 'ember-data';
import $ from 'jquery';
import ENV from 'webatrice/config/environment';

let FIREBASE_URL = ENV.firebase;
let IDLE_MS = 60000;

let session = Ember.Object.extend({
  ref: new Firebase(FIREBASE_URL),

  store: function() {
    return this.container.lookup('service:store');
  }.property(),

  log: function() {
    return this.container.lookup('log:main');
  }.property(),

  addFirebaseCallback: function() {
    let session = this;
    let store = this.get('store');

    this.get('ref').onAuth(function(authData) {
      Ember.run(function() {
        if (authData) {
          // Set the 'user' property to be a promise proxy that resolves when we
          // are done creating the user. Most people will just ignore the fact
          // that it was once a promise, but routes, for example, may need to
          // chain off of this so they know when the user is ready to use.
          //
          session.initializeUser(authData);
          session.set('isAuthenticated', true);
        } else {
          session.set('isAuthenticated', false);
        }
      });
    });
  }.on('init'),

  logout() {
    this.get('ref').unauth();
    this.set('user', null);
  },

  /**
   * Initialize a user record, bind a new presence record to it, and set the
   * user on the session.
   *
   * @param {Object} authData   The firebase auth object.
   *
   * @return {Promise}
   */
  initializeUser(authData) {
    let socialUserData;
    if (authData.provider !== 'password') {
      socialUserData = this.parseSocialData(authData);
    }
    let promise = this.updateOrCreateUser(authData.uid, socialUserData);
    let userPromiseProxy = DS.PromiseObject.create({
      promise: promise
    });
    this.set('user', userPromiseProxy);
    return userPromiseProxy.then(() => this.bindPresence());
  },

  trackActivity: function() {
    $(document).idleTimer({
      // Call user idle after this many milliseconds.
      timeout: IDLE_MS,
      // Recognize the following events as the user being active.
      events: 'mousemove keydown mousedown'
    });
    $(document).on('idle.idleTimer',
      this.onPresenceStateChange.bind(this, 'idle'));
    $(document).on('active.idleTimer',
      this.onPresenceStateChange.bind(this, 'online'));
  }.on('init'),

  /**
   * Updates an existing user profile or creates a new one.
   *
   * @param {String} uid              Unique id of the user.
   * @param {Object} socialUserData   Data provided from social provider.
   *
   * @return {Promise}
   */
  updateOrCreateUser(uid, socialUserData) {
    if (!uid) {
      log.error(`No uid passed for user: ${socialUserData}.`);
      return;
    }

    let store = this.get('store');
    let log = this.get('log');

    // Support old and new style user ids until all are transitioned.
    let query = uid;
    if (socialUserData && socialUserData.provider === 'github') {
      if (!socialUserData || !socialUserData.username) {
        let error = `No 3rd party auth data for ${uid}.`;
        log.error(`No 3rd party auth data for ${uid}.`);
        throw new Error(error);
      }
      query = {
        orderBy: 'username',
        equalTo: socialUserData.username
      };
    }

    function afterFind(user) {
      if (query.orderBy) {
        user = user.objectAt(0);
      }
      if (!user || user instanceof Error) {
        user = store.createRecord('user');
        user.set('id', uid);
      }
      if (socialUserData) {
        user.setProperties(socialUserData);
      }
      user.incrementProperty('visits');
      return user.save();
    }
    // The firebase adapter throws an error if a singular record is not found.
    return store.find('user', query).then(afterFind, afterFind);
  },

  onPresenceStateChange(state) {
    Ember.run(() => {
      if (!this.get('user.isFulfilled')) {
        return;
      }
      this.get('user.presence').then(function(presence) {
        presence.set('state', state);
        if (state === 'idle') {
          presence.set('lastSeen',
            moment().subtract(IDLE_MS, 'milliseconds').toDate());
        }
        presence.save();
      });
    });
  },

  /**
   * Set a user's online status.
   *
   * @return {Promise}
   */
  bindPresence() {
    // The user is a promise object that has resolved by now.
    let user = this.get('user.content');
    let amOnline = new Firebase(FIREBASE_URL + '/.info/connected');
    let store = this.get('store');
    let session = this;
    return user.get('presence').then(function(presence) {
      if (!presence) {
        presence = store.createRecord('presence', {
          user: user
        });
        user.set('presence', presence);
        user.save();
      }
      amOnline.on('value', function(snapshot) {
        Ember.run(() => {
          if (snapshot.val()) {
            let ref = presence.ref();
            ref.child('state')
              .onDisconnect()
              .set('offline');
            ref.child('lastSeen')
              .onDisconnect()
              .set(Firebase.ServerValue.TIMESTAMP);
            presence.set('state', 'online');
            presence.save();
          }
        });
      });
    });
  },

  loginWithSocial(provider) {
    return new Ember.RSVP.Promise(function(resolve, reject) {
      this.get('ref').authWithOAuthPopup(provider, function(error, user) {
        if (user) {
          Ember.run(() => resolve(user));
        } else {
          Ember.run(() => reject(error));
        }
      });
    }.bind(this));
  },

  /**
   * Log in using email and password.
   *
   * @param {String} email
   * @param {String} password
   *
   * @return {Promise}
   */
  loginWithPassword(email, password) {
    return new Ember.RSVP.Promise((resolve, reject) => {
      this.get('ref').authWithPassword({
        email: email,
        password: password
      }, (error, userData) => {
        if (error) {
          Ember.run(() => reject(error));
        } else {
          Ember.run(() => resolve(userData));
        }
      });
    });
  },

  /**
   * Create a new firebase user.
   *
   * @param {String} username
   * @param {String} email
   * @param {String} password
   *
   * @return {Promise}
   */
  signupWithPassword(username, email, password) {
    return new Ember.RSVP.Promise((resolve, reject) => {
      this.get('ref').createUser({
        email: email,
        password: password
      }, (error, userData) => {
        if (error) {
          Ember.run(() => reject(error));
        } else {
          Ember.run(() => {
            resolve(this.createPasswordUser(Ember.merge(userData, {
              username: username,
              email: email,
              password: password
            })));
          });
        }
      });
    }).then(() => {
      return this.loginWithPassword(email, password);
    });
  },

  createPasswordUser(userData) {
    let store = this.get('store');
    let user = store.createRecord('user');
    user.setProperties(userData);
    user.set('id', userData.uid);
    user.set('avatarUrl',
      `https://www.gravatar.com/avatar/${md5(userData.email)}?s=250&d=retro`);
    return user.save();
  },

  currentUser: function() {
    return this.get('ref').getAuth();
  }.property('isAuthenticated'),

  /**
   * Parse user info from a given provider out of the authData object passed
   * back from Firebase.
   *
   * @param {Object} authData   The user info object given from Firebase auth.
   *
   * @return {Object} Parsed user info.
   */
  parseSocialData(authData) {
    let log = this.get('log');
    if (!authData) {
      log.error('No authData provided to parseSocialData.');
    }
    let userData;

    let provider = authData.provider;
    if (provider === 'github') {
      userData = {
        username: authData.github.username,
        avatarUrl: authData.github.cachedUserProfile.avatar_url,
        displayName: authData.github.displayName,
        email: authData.github.email,
        provider: provider
      };
    } else if (provider === 'twitter') {
      userData = {
        username: authData.twitter.username,
        avatarUrl: `http://avatars.io/twitter/${authData.twitter.username}?size=large`,
        displayName: authData.twitter.displayName,
        provider: provider
      };
    } else {
      provider = provider || '<null>';
      log.error(`Cannot parse user data for provider ${provider}.`);
    }
    return userData;
  },

  /** @property {Boolean} A convenience property to see if the user can write to
   *                      Firebase.
   */
  hasWriteAccess: Ember.computed.readOnly('isAuthenticated'),

  /** @property {Boolean} A convenience property to see if the user can write to
   *                      Firebase.
   */
  doesNotHaveWriteAccess: Ember.computed.not('hasWriteAccess'),
});

export default {
  name: 'Session',

  initialize(container, app) {
    app.register('session:main', session);
    app.inject('controller', 'session', 'session:main');
    app.inject('route', 'session', 'session:main');
  }
};
