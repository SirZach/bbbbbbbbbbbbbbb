import Ember from 'ember';

export default Ember.Route.extend({
  beforeModel: function () {
    if (!this.get('session.isAuthenticated')) {
      this.replaceWith('/');
    }
  },

  model: function () {
    var store = this.store;
    return this.get('session.user').then(function (user) {
      return store.find('deck', {
        orderBy: 'owner',
        equalTo: user.get('id')
      });
    });
  },

  actions: {
    goToDeck: function (deck) {
      this.transitionTo('deck.build', deck);
    },

    importDeck: function () {
      this.send('openModal', 'decks/import-deck');
    }
  }
});
