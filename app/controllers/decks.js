import Ember from 'ember';

export default Ember.ArrayController.extend({
  queryParams: ['mine'],

  /** @property {Boolean} Is the filters column enabled? */
  filtersActive: false,

  /** @property {Boolean} Query param - filter by my decks only? */
  mine: false,

  actions: {
    toggleFiltersActive() {
      this.toggleProperty('filtersActive');
    }
  }
});
