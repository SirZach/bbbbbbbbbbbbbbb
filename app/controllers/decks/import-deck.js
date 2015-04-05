import Ember from 'ember';
import Deck from 'webatrice/models/deck';

export default Ember.Controller.extend({
  needs: ['cards'],

  actions: {
    close: function() {
      return this.send('closeModal');
    },

    importDeck: function () {
      // var cards = this.get('controllers.cards.model');
      var result = Deck.createFromImport(this.get('importContents'), this.store);
      var deck = result.deck;
      var errors = result.errors;
      // TODO: maybe display these somehow?
      if (errors.length) {
        console.log(errors.join('\n'));
      }

      deck.set('owner', this.get('session.user.content'));

      this.send('closeModal');
      this.transitionToRoute('deck.build', deck);
    }
  }
});
