import Ember from 'ember';

export default Ember.Route.extend({

  queryParams: {
    nameSearch: {refreshModel: true},
    page: {refreshModel: true}
  },

  model: function (params) {
    return this.store.findQuery('card', params);
  },

  actions: {
    typesChanged: function () {
      this.refresh();
    },
    colorsChanged: function () {
      this.refresh();
    },
    legalitiesChanged: function () {
      this.refresh();
    },
    loading: function (/* transition, originRoute */) {
      return false;
    },
    showCard: function (card) {
      this.transitionTo('card', Ember.get(card, 'name'));
    }
  }
});
