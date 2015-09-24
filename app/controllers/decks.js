import Ember from 'ember';

export default Ember.Controller.extend({
  queryParams: ['mine'],

  /** @property {Boolean} Is the filters column enabled? */
  filtersActive: false,

  /** @property {Boolean} Query param - filter by my decks only? */
  mine: false,

  /** @property {String} Title to show in the toolbar. */
  pageTitle: Ember.computed('mine', function() {
    var mine = this.get('mine');
    return mine ? 'My Decks' : 'Everybody\'s Decks';
  }),

  actions: {
    toggleFiltersActive() {
      this.toggleProperty('filtersActive');
    }
  }
});
