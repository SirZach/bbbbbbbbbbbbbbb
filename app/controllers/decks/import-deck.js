import Ember from 'ember';
import Deck from 'webatrice/models/deck';

export default Ember.Controller.extend({
  needs: ['cards'],

  actions: {
    close() {
      return this.send('closeModal');
    },

    importDeck() {
      let importContents = this.get('importContents');

      this.get('session.user').then((user) => {
        Deck.createFromImport(importContents, this.store).then((result) => {
          let { deck } = result;
          deck.set('owner', user);
          let { errors } = result;

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
