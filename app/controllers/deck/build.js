import Ember from 'ember';
const { inject } = Ember;

export default Ember.Controller.extend({
  cardsController: inject.controller('cards'),
  deckController: inject.controller('deck'),

  filtersActive: false,

  doNotShowTypes: [],

  nameSearch: Ember.computed.alias('cardsController.nameSearch'),

  _triggerCardLookup: function() {
    this.send('getNewCards');
  },

  nameSearchDidChange: function() {
    Ember.run.debounce(this, '_triggerCardLookup', 500);
  }.observes('nameSearch'),

  filteredCards: Ember.computed.alias('cardsController.model'),

  canShowDeckTable: function() {
    return this.get('model.cardGroups.length');
  }.property('model.cardGroups.[]'),

  actions: {
    toggleFiltersActive: function() {
      this.toggleProperty('filtersActive');
    },

    clearFailedImports: function() {
      this.set('model.failedImports');
    }
  }
});
