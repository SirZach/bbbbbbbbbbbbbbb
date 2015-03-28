import Ember from 'ember';
import InfiniteScrollMixin from 'webatrice/mixins/infinite-scroll';

export default Ember.ArrayController.extend(InfiniteScrollMixin, {
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

  hasMore: function () {
    return this.get('iterable.length') < this.get('model.length');
  }.property('iterable.[]', 'model.[]'),

  repopulateIterable: function () {
     this._super();

     //this.get('iterable').pushObjects(this.get('searchedContent').slice(0, this.get('chunkSize'))); //hydrating iterable when the model you care about changes
   }.observes('searchedContent.[]', 'model.[]'),


  actions: {
    toggleFiltersActive: function () {
      this.toggleProperty('filtersActive');
    },

    fetchMore: function (callback) {
      debugger;
      var model = this.get('searchedContent');
      var promise = this.populateIterable(model);
      callback(promise);
    }
  }
});
