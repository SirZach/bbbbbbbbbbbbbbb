import Ember from 'ember';

export default Ember.Controller.extend({
  needs: ['cards', 'deck'],

  filtersActive: false,

  doNotShowTypes: [],

  nameSearch: Ember.computed.alias('controllers.cards.nameSearch'),

  _triggerCardLookup: function () {
    this.send('getNewCards');
  },

  nameSearchDidChange: function () {
    Ember.run.debounce(this, '_triggerCardLookup', 500);
  }.observes('nameSearch'),

  filteredCards: Ember.computed.alias('controllers.cards.model'),

  canShowDeckTable: function () {
    return this.get('model.cardGroups.length');
  }.property('model.cardGroups.[]'),

  actions: {
    toggleFiltersActive: function () {
      this.toggleProperty('filtersActive');
    },

    clearFailedImports: function () {
      this.set('model.failedImports');
    }
  }
});
