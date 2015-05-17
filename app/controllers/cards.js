import Ember from 'ember';

export default Ember.ArrayController.extend({
  /** @property {Array} array container for type query params*/
  types: [],

  /** @property {Array} array container for color query params*/
  colors: [],

  /** @property {Array} array container for legality query params*/
  legalities: [],

  /** @property {String} the current search term */
  nameSearch: ''
});
