import Ember from 'ember';
import InfiniteScrollMixin from 'webatrice/mixins/infinite-scroll';

export default Ember.ObjectController.extend(InfiniteScrollMixin, {
  needs: ['sets', 'cards', 'deck'],

  filtersActive: false,

  doNotShowTypes: [],

  searchTerm: Ember.computed.alias('controllers.cards.searchTerm'),

  searchedContent: Ember.computed.alias('controllers.cards.searchedContent'),

  canShowMainDeck: function () {
    return !this.get('doNotShowTypes').contains('mainDeck');
  }.property('doNotShowTypes.@each'),

  canShowSideDeck: function () {
    return !this.get('doNotShowTypes').contains('sideDeck');
  }.property('doNotShowTypes.@each'),

  canShowDeckTable: function () {
    return this.get('cards.length') || this.get('sideboard.length');
  }.property('cards.@each', 'sideboard.@each'),

  hasMore: function () {
    return this.get('iterable.length') < this.get('controllers.cards.model.length');
  }.property('iterable.[]', 'controllers.cards.model.[]'),

  repopulateIterable: function () {
     this._super();

     this.get('iterable').pushObjects(this.get('searchedContent').slice(0, this.get('chunkSize'))); //hydrating iterable when the model you care about changes
   }.observes('searchedContent.[]', 'model.[]'),

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
    },

    fetchMore: function (callback) {
      var model = this.get('searchedContent');
      var promise = this.populateIterable(model);
      callback(promise);
    }
  }
});
