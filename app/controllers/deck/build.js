import Ember from 'ember';

export default Ember.Controller.extend({
  needs: ['sets', 'cards', 'deck'],

  filtersActive: false,

  doNotShowTypes: [],

  nameSearch: Ember.computed.alias('controllers.cards.nameSearch'),

  nameSearchDidChange: function () {
    Ember.run.later(this, function () {
      this.send('getNewCards');
    });
  }.observes('nameSearch'),

  filteredCards: Ember.computed.alias('controllers.cards.model'),

  canShowMainDeck: function () {
    return !this.get('doNotShowTypes').contains('mainDeck');
  }.property('doNotShowTypes.@each'),

  canShowSideDeck: function () {
    return !this.get('doNotShowTypes').contains('sideDeck');
  }.property('doNotShowTypes.@each'),

  canShowDeckTable: function () {
    return this.get('cards.length') || this.get('sideboard.length');
  }.property('cards.@each', 'sideboard.@each'),

  actions: {
    toggleFiltersActive: function () {
      this.toggleProperty('filtersActive');
    },

    showHide: function (superType) {
      var doNotShowTypes = this.get('doNotShowTypes');

      if (doNotShowTypes.contains(superType)) {
        doNotShowTypes.removeAt(doNotShowTypes.indexOf(superType));
      } else {
        doNotShowTypes.pushObject(superType);
      }
    }
  }
});
