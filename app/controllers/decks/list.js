import Ember from 'ember';

export default Ember.Controller.extend({
  needs: ['decks'],

  /** @property {Boolean} Is the filters column enabled? */
  filtersActive: false,

  /** @property {Boolean} Showing only my decks? */
  filterMineOnly: Ember.computed.alias('controllers.decks.mine'),

  /** @property {String} Title to show in the toolbar. */
  pageTitle: Ember.computed('controllers.decks.mine', function () {
    var mine = this.get('controllers.decks.mine');
    return mine ? 'My Decks' : 'Everybody\'s Decks';
  }),

  actions: {
    toggleFiltersActive: function () {
      this.toggleProperty('filtersActive');
    }
  }
});
