import Ember from 'ember';

export default Ember.Controller.extend({
  needs: ['cards', 'deck'],

  filtersActive: false,

  doNotShowTypes: [],

  nameSearch: Ember.computed.alias('controllers.cards.nameSearch'),

  nameSearchDidChange: function () {
    Ember.run.later(this, function () {
      this.send('getNewCards');
    });
  }.observes('nameSearch'),

  filteredCards: Ember.computed.alias('controllers.cards.model'),

  canShowDeckTable: function () {
    return this.get('model.cardGroups.length');
  }.property('model.cardGroups.@each'),

  actions: {
    toggleFiltersActive: function () {
      this.toggleProperty('filtersActive');
    },

    clearFailedImports: function () {
      this.set('model.failedImports');
    }
  }
});
