import Ember from 'ember';

var session = Ember.Object.extend({
  ref: new Firebase('https://dazzling-fire-7827.firebaseio.com'),

  addFirebaseCallback: function () {
    var session = this;

    this.get('ref').onAuth(function (authData) {
      if (authData) {
        var store = this.container.lookup('store:main');
        var username = authData.github.username;
        var avatarUrl = authData.github.cachedUserProfile.avatar_url;
        var displayName = authData.github.displayName;
        var email = authData.github.email;
        store.find('user', {
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
          user.save();
        });
        session.set('isAuthenticated', true);
      } else {
        session.set('isAuthenticated', false);
      }
    }.bind(this));
  }.on('init'),

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
