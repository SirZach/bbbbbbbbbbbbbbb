import Ember from 'ember';
import Deck from 'webatrice/models/deck';

export default Ember.Controller.extend({
  needs: ['cards'],

  actions: {
    close: function() {
      return this.send('closeModal');
    },

    importDeck: function() {
      let importContents = this.get('importContents');
      
      this.get('session.user').then((user) => {
        Deck.createFromImport(importContents, this.store).then((result) => {
          let deck = result.deck;
          deck.set('owner', user);
          let errors = result.errors;

          if (errors.length) {
            deck.set('failedImports', errors);
          }

          this.send('closeModal');
          this.set('importContents');
          this.transitionToRoute('deck.build', deck);
        });
      });
    }
  }
});
