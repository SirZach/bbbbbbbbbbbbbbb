import Ember from 'ember';
import InfinityRoute from 'ember-infinity/mixins/route';

export default Ember.Route.extend(InfinityRoute, {
  afterModel: function (deck) {
    return deck.get('owner').then((owner) => {
      return this.get('session.user').then((user) => {
        if (owner.get('id') !== user.get('id')) {
          this.transitionTo('/');
        }
      });
    });
  },

  actions: {
    willTransition: function (transition) {
      var deck = this.get('controller.model');

      if (deck.get('isNew')) {
        deck.destroyRecord();
      }
    },

    getNewCards: function () {
      var cardsController = this.controllerFor('cards');
      var colors = cardsController.get('colors');
      var legalities = cardsController.get('legalities');
      var types = cardsController.get('types');
      var nameSearch = cardsController.get('nameSearch');
      // Ember Infinity-prescribed configuration - perPage and modelPath.
      var perPage = 20;
      var modelPath = 'controller.controllers.cards.model';

      this.set(modelPath, []);

      var query = {
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
      var infinityModel = this.infinityModel('card', query);
      infinityModel.then((cards) => {
        this.get(modelPath).pushObjects(cards.get('content'));
      });
    }
  }
});
