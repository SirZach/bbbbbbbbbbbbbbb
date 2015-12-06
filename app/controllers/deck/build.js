import Ember from 'ember';
const { inject } = Ember;

export default Ember.Controller.extend({
  cardsController: inject.controller('cards'),
  deckController: inject.controller('deck'),

  filtersActive: false,

  doNotShowTypes: [],

  nameSearch: Ember.computed.alias('cardsController.nameSearch'),

  _triggerCardLookup() {
    this.send('getNewCards');
  },

  nameSearchDidChange: function() {
    Ember.run.debounce(this, '_triggerCardLookup', 500);
  }.observes('nameSearch'),

  filteredCards: Ember.computed.alias('cardsController.model'),

  canShowDeckTable: function() {
    return this.get('model.cardGroups.length');
  }.property('model.cardGroups.[]'),

  /** @property {String} - url of most expensive cmc card in the deck */
  defaultImageUrl: Ember.computed('model.mainCardGroups.@each.cmc', function() {
    let cardGroups = this.get('model.mainCardGroups');
    if (!cardGroups || !cardGroups.length) {
      return 'http://big-furry-monster.herokuapp.com/images/default';
    }
    return cardGroups.sortBy('card.cmc').get('lastObject.card.imageUrl');
  }),

  actions: {
    toggleFiltersActive() {
      this.toggleProperty('filtersActive');
    },

    clearFailedImports() {
      this.set('model.failedImports');
    }
  }
});
