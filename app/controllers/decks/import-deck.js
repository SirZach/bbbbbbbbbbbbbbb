import Ember from 'ember';
import Deck from 'webatrice/models/deck';

export default Ember.Controller.extend({
  needs: ['cards'],

  actions: {
    close: function() {
      return this.send('closeModal');
    },

    importDeck: function () {
      var importContents = this.get('importContents');
      var self = this;
      Deck.createFromImport(importContents, this.store).then(function (result) {
        var deck = result.deck;
        var errors = result.errors;

        if (errors.length) {
          deck.set('failedImports', errors);
        }

        deck.set('owner', self.get('session.user.content'));

        self.send('closeModal');
        self.transitionToRoute('deck.build', deck);
      });
    }
  }
});
