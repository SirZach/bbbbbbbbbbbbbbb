import Ember from 'ember';
import $ from 'jquery';

var FIREBASE_URL = 'https://dazzling-fire-7827.firebaseio.com';
var IDLE_MS = 60000;

var session = Ember.Object.extend({
  ref: new Firebase(FIREBASE_URL),

  addFirebaseCallback: function () {
    var session = this;

    this.get('ref').onAuth(function (authData) {
      if (authData) {
        this.updateOrCreateUser(authData).then(function (user) {
          session.bindPresence(user);
        });
        session.set('isAuthenticated', true);
      } else {
        session.set('isAuthenticated', false);
      }
    }.bind(this));
  }.on('init'),

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
   * @param {Object} authData   The object given to us from .onAuth().
   *
   * @return {Promise}
   */
  updateOrCreateUser: function (authData) {
    var store = this.container.lookup('store:main');
    var username = authData.github.username;
    var avatarUrl = authData.github.cachedUserProfile.avatar_url;
    var displayName = authData.github.displayName;
    var email = authData.github.email;
    var self = this;
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
        email: email
      });
      user.incrementProperty('visits');
      self.set('user', user);
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
   */
  bindPresence: function () {
    var user = this.get('user');
    var amOnline = new Firebase(FIREBASE_URL + '/.info/connected');
    var store = this.container.lookup('store:main');
    var presenceType = store.modelFor('presence');
    user.get('presence').then(function (presence) {
      if (!presence) {
        presence = store.createRecord('presence', {
          user: user
        });
        user.set('presence', presence);
        user.save();
      }
      amOnline.on('value', function(snapshot) {
        if (snapshot.val()) {
          var adapter = store.adapterFor('presence');
          var ref = adapter._getRef(presenceType, presence.get('id'));
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
  }.property('isAuthenticated')
});

export default {
  name: "Session",

  initialize: function (container, app) {
    app.register('session:main', session);
    app.inject('controller', 'session', 'session:main');
    app.inject('route', 'session', 'session:main');
  }
};
