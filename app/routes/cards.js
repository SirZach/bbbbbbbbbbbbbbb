import Ember from 'ember';

export default Ember.Route.extend({
  renderTemplate: function () {
    this._super.apply(this, arguments);

    this.render('nav-toolbars/cards', {
      into: 'application',
      outlet: 'nav-toolbar'
    });
  },

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
