import Ember from 'ember';

export default Ember.Route.extend({
  model: function () {
    return this.store.filter('game', {
      orderBy: 'createdDate'
    }, function () {
      return true;
    });
  },

  redirect: function (model, transition) {
    if (transition.targetName === 'games.index') {
      this.transitionTo('games.list');
    }
  },

  actions: {
    deleteGame: function (game) {
      var gameId = game.get('id');
      var store = this.store;
      var notifications = this.notifications;

      game.destroyRecord().then(() => {
        store.find('chat', {
          orderBy: 'channel',
          equalTo: gameId
        }).then(function (gameChats) {
          var promises = gameChats.map((chat) => chat.destroyRecord());
          Ember.RSVP
            .all(promises)
            .then(() => {
              notifications.addNotification({
                message: 'Deleted',
                type: 'success',
                autoClear: true,
                clearDuration: 1200
              });
            })
            .catch((error) => {
              notifications.addNotification({
                message: error.message,
                type: 'error'
              });
            });
        });
      })
      .catch((error) => {
        notifications.addNotification({
          message: error.message,
          type: 'error'
        });
      });
    }
  }
});
