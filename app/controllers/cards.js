import Ember from 'ember';

export default Ember.ArrayController.extend({
  queryParams: ['nameSearch', 'types', 'colors', 'legalities', 'page'],

  /** @property {Boolean} can you see the filters panel?*/
  filtersActive: false,

  /** @property {Array} array container for type query params*/
  types: [],

  /** @property {Array} array container for color query params*/
  colors: [],

  /** @property {Array} array container for legality query params*/
  legalities: [],

  /** @property {Number} the page number of cards to retrieve*/
  page: 0,

  /** @property {String} the current search term */
  nameSearch: '',

  filteredCards: Ember.computed.alias('model'),

  actions: {
    toggleFiltersActive: function () {
      this.toggleProperty('filtersActive');
    }
  }
});
