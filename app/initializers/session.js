import Ember from 'ember';
import DS from 'ember-data';
import $ from 'jquery';

var FIREBASE_URL = 'https://dazzling-fire-7827.firebaseio.com';
var IDLE_MS = 60000;

var session = Ember.Object.extend({
  ref: new Firebase(FIREBASE_URL),

  store: function () {
    return this.container.lookup('store:main');
  }.property(),

  log: function () {
    return this.container.lookup('log:main');
  }.property(),

  addFirebaseCallback: function () {
    var session = this;
    var store = this.get('store');

    this.get('ref').onAuth(function (authData) {
      Ember.run.next(function () {
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

  logout: function () {
    this.get('ref').unauth();
  },

  /**
   * Initialize a user record, bind a new presence record to it, and set the
   * user on the session.
   *
   * @param {Object} authData   The firebase auth object.
   *
   * @return {Promise}
   */
  initializeUser: function (authData) {
    var socialUserData;
    if (authData.provider !== 'password') {
      socialUserData = this.parseSocialData(authData);
    }
    var promise = this.updateOrCreateUser(authData.uid, socialUserData);
    var userPromiseProxy = DS.PromiseObject.create({
      promise: promise
    });
    this.set('user', userPromiseProxy);
    return userPromiseProxy.then(() => this.bindPresence());
  },

  trackActivity: function () {
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
  updateOrCreateUser: function (uid, socialUserData) {
    if (!uid) {
      log.error(`No uid passed for user: ${socialUserData}.`);
      return;
    }

    var store = this.get('store');
    var log = this.get('log');

    // Support old and new style user ids until all are transitioned.
    var query = uid;
    if (socialUserData && socialUserData.provider === 'github') {
      if (!socialUserData || !socialUserData.username) {
        var error = `No 3rd party auth data for ${uid}.`;
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

  onPresenceStateChange: function (state) {
    if (!this.get('user.isFulfilled')) {
      return;
    }
    this.get('user.presence').then(function (presence) {
      presence.set('state', state);
      if (state === 'idle') {
        presence.set('lastSeen',
          moment().subtract(IDLE_MS, 'milliseconds').toDate());
      }
      presence.save();
    });
  },

  /**
   * Set a user's online status.
   *
   * @return {Promise}
   */
  bindPresence: function () {
    // The user is a promise object that has resolved by now.
    var user = this.get('user.content');
    var amOnline = new Firebase(FIREBASE_URL + '/.info/connected');
    var store = this.get('store');
    var session = this;
    return user.get('presence').then(function (presence) {
      if (!presence) {
        presence = store.createRecord('presence', {
          user: user
        });
        user.set('presence', presence);
        user.save();
      }
      amOnline.on('value', function (snapshot) {
        if (snapshot.val()) {
          var ref = store.refFor('presence', presence);
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
  },

  loginWithSocial: function (provider) {
    return new Ember.RSVP.Promise(function (resolve, reject) {
      this.get('ref').authWithOAuthPopup(provider, function (error, user) {
        if (user) {
          resolve(user);
        } else {
          reject(error);
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
  loginWithPassword: function (email, password) {
    return new Ember.RSVP.Promise((resolve, reject) => {
      this.get('ref').authWithPassword({
        email: email,
        password: password
      }, (error, userData) => {
        if (error) {
          reject(error);
        } else {
          resolve(userData);
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
  signupWithPassword: function (username, email, password) {
    return new Ember.RSVP.Promise((resolve, reject) => {
      this.get('ref').createUser({
        email: email,
        password: password
      }, (error, userData) => {
        if (error) {
          reject(error);
        } else {
          resolve(this.createPasswordUser(Ember.merge(userData, {
            username: username,
            email: email,
            password: password
          })));
        }
      });
    }).then(() => {
      return this.loginWithPassword(email, password);
    });
  },

  createPasswordUser: function (userData) {
    var store = this.get('store');
    var user = store.createRecord('user');
    user.setProperties(userData);
    user.set('id', userData.uid);
    user.set('avatarUrl',
      `https://www.gravatar.com/avatar/${md5(userData.email)}?s=250&d=retro`);
    return user.save();
  },

  currentUser: function () {
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
  parseSocialData: function (authData) {
    var log = this.get('log');
    if (!authData) {
      log.error('No authData provided to parseSocialData.');
    }
    var userData;

    var provider = authData.provider;
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
  name: "Session",

  initialize: function (container, app) {
    app.register('session:main', session);
    app.inject('controller', 'session', 'session:main');
    app.inject('route', 'session', 'session:main');
  }
};
