import Ember from 'ember';

export default Ember.Route.extend({
  beforeModel: function () {
    if (!this.get('session.isAuthenticated')) {
      this.replaceWith('/');
    }
  },

  model: function () {
    return this.store.find('deck', {
      orderBy: 'owner',
      equalTo: this.get('session.currentUser.github.username')
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
