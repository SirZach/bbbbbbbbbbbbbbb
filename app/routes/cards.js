import Ember from 'ember';

export default Ember.Route.extend({
  queryParams: {
    nameSearch: {refreshModel: true},
    types: {refreshModel: true},
    colors: {refreshModel: true},
    legalities: {refreshModel: true},
    page: {refreshModel: true}
  },

  model: function (params) {
    return this.store.findQuery('card', params);
  },

  actions: {
    loading: function (transition, originRoute) {
      return false;
    },
    showCard: function (card) {
      this.transitionTo('card', Ember.get(card, 'name'));
    }
  }
});
