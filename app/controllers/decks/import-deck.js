import Ember from 'ember';
import Deck from 'webatrice/models/deck';

export default Ember.Controller.extend({
  needs: ['cards'],

  actions: {
    close: function() {
      return this.send('closeModal');
    },

    importDeck: function () {
      var cards = this.get('controllers.cards.model'),
        deck = Deck.createDeck(this.get('importContents'), cards);

      this.send('closeModal');
      this.transitionToRoute('deck.build', deck);
    }
  }
});
