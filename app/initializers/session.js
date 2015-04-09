import Ember from 'ember';
import DS from 'ember-data';
import $ from 'jquery';
import NameGenerator from 'webatrice/utils/name-generator';

var FIREBASE_URL = 'https://dazzling-fire-7827.firebaseio.com';
var IDLE_MS = 60000;

var session = Ember.Object.extend({
  ref: new Firebase(FIREBASE_URL),

  addFirebaseCallback: function () {
    var session = this;

    // Right away create an anonymous user for the session if it is obvious this
    // person is not logged in.
    //
    if (!this.get('ref').getAuth()) {
      this.initializeUser().then(function () {
        // Prepare to tear down the anonymous user.
        var userRef = session.refFor('user', session.get('user.content'));
        userRef.onDisconnect().remove();
        var presenceRef = session.refFor('presence',
          session.get('user.content.presence.content'));
        presenceRef.onDisconnect().remove();
      });
    }

    this.get('ref').onAuth(function (authData) {
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
  }.on('init'),

  /**
   * Initialize a user record, bind a new presence record to it, and set the
   * user on the session.
   *
   * @param {Object} authData   The firebase auth object.
   *
   * @return {Promise}
   */
  initializeUser: function (authData) {
    var session = this;
    var anonymousUser = this.get('user.content');
    var anonymousPresensce = this.get('user.content.presence.content');
    if (anonymousUser) {
      anonymousUser.destroyRecord();
    }
    if (anonymousPresensce) {
      anonymousPresensce.destroyRecord();
    }
    var promise = this.updateOrCreateUser(authData);
    var userPromiseProxy = DS.PromiseObject.create({
      promise: promise
    });
    this.set('user', userPromiseProxy);
    return userPromiseProxy.then(function () {
      return session.bindPresence();
    });
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
   * @param {Object} authData   The object given to us from .onAuth(). If null,
   *                            create an anonymous user.
   *
   * @return {Promise}
   */
  updateOrCreateUser: function (authData) {
    var store = this.container.lookup('store:main');
    var username;
    var avatarUrl;
    var displayName;
    var email;
    if (authData) {
      username = authData.github.username;
      avatarUrl = authData.github.cachedUserProfile.avatar_url;
      displayName = authData.github.displayName;
      email = authData.github.email;
    } else {
      username = NameGenerator.name();
      avatarUrl = NameGenerator.avatarUrl();
    }
    return store.find('user', {
      orderBy: 'username',
      equalTo: username
    }).then(function (records) {
      var user;
      if (records.get('length')) {
        user = records.objectAt(0);
      } else {
        user = store.createRecord('user');
      }
      user.setProperties({
        username: username,
        avatarUrl: avatarUrl,
        displayName: displayName,
        email: email,
        isAnonymous: !authData
      });
      user.incrementProperty('visits');
      return user.save();
    });
  },

  onPresenceStateChange: function (state) {
    if (!this.get('isAuthenticated')) {
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
    var store = this.container.lookup('store:main');
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
          var ref = session.refFor('presence', presence);
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

  login: function () {
    return new Ember.RSVP.Promise(function (resolve, reject) {
      this.get('ref').authWithOAuthPopup('github', function (error, user) {
        if (user) {
          resolve(user);
        } else {
          reject(error);
        }
      });
    }.bind(this));
  },

  currentUser: function () {
    return this.get('ref').getAuth();
  }.property('isAuthenticated'),

  /**
   * Get the firebase ref for the given record of the given type.
   *
   * @param {String} type   E.g. 'presence'.
   * @param {Model} record  A model instance.
   */
  refFor: function (type, record) {
    var store = this.container.lookup('store:main');
    var adapter = store.adapterFor(type);
    var modelType = store.modelFor(type);
    return adapter._getRef(modelType, record.get('id'));
  }
});

export default {
  name: "Session",

  initialize: function (container, app) {
    app.register('session:main', session);
    app.inject('controller', 'session', 'session:main');
    app.inject('route', 'session', 'session:main');
  }
};
