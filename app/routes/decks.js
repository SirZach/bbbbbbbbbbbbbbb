import Ember from 'ember';

export default Ember.Route.extend({
  model: function () {
    return [];
  },

  actions: {
    showCard: function (card) {
      this.controllerFor('deck.build').set('selectedCard', card);
    }
  }
});
