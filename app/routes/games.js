import Ember from 'ember';

export default Ember.Route.extend({
  redirect(model, transition) {
    if (transition.targetName === 'games.index') {
      this.transitionTo('games.list');
    }
  },

  actions: {
    deleteGame(game) {
      let gameId = game.get('id');
      let { store, notifications } = this;

      game.destroyRecord().then(() => {
        store.find('chat', {
          orderBy: 'channel',
          equalTo: gameId
        }).then(function(gameChats) {
          let promises = gameChats.map((chat) => chat.destroyRecord());
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
