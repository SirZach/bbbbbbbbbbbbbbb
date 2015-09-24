import Ember from 'ember';
import InfinityRoute from 'ember-infinity/mixins/route';

export default Ember.Route.extend(InfinityRoute, {
  afterModel: function(deck) {
    return deck.get('owner').then((owner) => {
      return this.get('session.user').then((user) => {
        if (owner.get('id') !== user.get('id')) {
          this.transitionTo('/');
        }
      });
    });
  },

  actions: {
    willTransition: function(transition) {
      let deck = this.get('controller.model');

      if (deck.get('isNew')) {
        deck.destroyRecord();
      }
    },

    getNewCards: function() {
      let cardsController = this.controllerFor('cards');
      let colors = cardsController.get('colors');
      let legalities = cardsController.get('legalities');
      let types = cardsController.get('types');
      let nameSearch = cardsController.get('nameSearch');
      // Ember Infinity-prescribed configuration - perPage and modelPath.
      let perPage = 20;
      let modelPath = 'controller.cardsController.model';

      this.set(modelPath, []);

      let query = {
        colors,
        legalities,
        types,
        nameSearch,
        perPage,
        modelPath
      };

      // We don't actually need to store infinityModel anywhere. The mixin
      // stashes relevant information. When it resolves the first time, push the
      // cards it finds into our card controller. Subsequent loads will be
      // pushed to that controller by the mixin.
      //
      let infinityModel = this.infinityModel('card', query);
      infinityModel.then((cards) => {
        this.get(modelPath).pushObjects(cards.toArray());
      });
    }
  }
});
