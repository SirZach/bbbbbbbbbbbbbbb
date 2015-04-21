import Ember from 'ember';

export default Ember.Route.extend({
  beforeModel: function () {
    if (!this.get('session.isAuthenticated')) {
      this.replaceWith('/');
    }
  },

  model: function () {
    return this.get('session.user').then((user) => user.get('decks'));
  },

  actions: {
    deleteDeck: function (deck) {
      deck.destroyRecord()
        .then(() => {
          this.notifications.addNotification({
            message: 'Deleted',
            type: 'success',
            autoClear: true,
            clearDuration: 1200
          });
        })
        .catch(() => {
          this.notifications.addNotification({
            message: 'Error',
            type: 'error'
          });
        });
    },
    
    createNewDeck: function () {
      this.transitionTo('deck.build', 'new');
    },
    goToDeck: function (deck) {
      this.transitionTo('deck.build', deck);
    },

    importDeck: function () {
      this.send('openModal', 'decks/import-deck');
    }
  }
});
