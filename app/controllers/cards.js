import Ember from 'ember';
import InfiniteScrollMixin from 'webatrice/mixins/infinite-scroll';

export default Ember.ArrayController.extend(InfiniteScrollMixin, {
  queryParams: ['searchTerm', 'typesSelected', 'colorsSelected',
                'legalitiesSelected'],

  filtersActive: false,

  typesSelected: [],

  colorsSelected: [],

  legalitiesSelected: [],

  filteredCards: function () {
    var cards = this.get('arrangedContent'),
        typesSelected = this.get('typesSelected'),
        colorsSelected = this.get('colorsSelected'),
        legalitiesSelected = this.get('legalitiesSelected').map(function (l) {
          return 'is' + l;
        });

    if (typesSelected.length) {
      cards = cards.filter(function (c) {
        return typesSelected.contains(c.get('mainType'));
      });
    }

    if (colorsSelected.length) {
      cards = cards.filter(function (c) {
        var found = false,
            colors = c.get('colors');
        if (!colors) {
          return false;
        }
        colors.forEach(function (color) {
          if (colorsSelected.contains(color)) {
            found = true;
          }
        });
        return found;
      });
    }

    if (legalitiesSelected.length) {
      cards = cards.filter(function (c) {
        var isLegal = false;
        legalitiesSelected.forEach(function (l) {
          if (c.get(l)) {
            isLegal = true;
          }
        });

        return isLegal;
      });
    }

    return cards;
  }.property('arrangedContent', 'typesSelected.[]',
    'colorsSelected.[]', 'legalitiesSelected.[]'),

  displayCards: function () {
    return this.get('searchedContent').slice(0, 100);
  }.property('searchedContent'),

  searchedContent: function () {
    var searchTerm = this.get('searchTerm'),
        filteredCards = this.get('filteredCards');

    if (!searchTerm) {
      return filteredCards;
    }

    return filteredCards.filter(function (c) {
      return c.name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
    });
  }.property('filteredCards', 'searchTerm'),

  /** @property {String} the current search term */
  searchTerm: '',

  hasMore: function () {
    return this.get('iterable.length') < this.get('displayCards.length');
  }.property('iterable.[]', 'displayCards.[]'),

  repopulateIterable: function () {
     this._super();

     this.get('iterable').pushObjects(this.get('searchedContent').slice(0, this.get('chunkSize'))); //hydrating iterable when the model you care about changes
   }.observes('searchedContent.[]', 'model.[]'),


  actions: {
    toggleFiltersActive: function () {
      this.toggleProperty('filtersActive');
    },

    fetchMore: function (callback) {
      var model = this.get('searchedContent');
      var promise = this.populateIterable(model);
      callback(promise);
    }
  }
});
