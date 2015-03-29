import Ember from 'ember';
import Deck from '../models/deck';

export default Ember.Route.extend({
  model: function () {
    return Deck.create({});
  },

  actions: {
    typesChanged: function () {
      this.send('getNewCards');
    },

    colorsChanged: function () {
      this.send('getNewCards');
    },

    legalitiesChanged: function () {
      this.send('getNewCards');
    },

    getNewCards: function () {
      var cardsController = this.controllerFor('cards');
      var page = cardsController.get('page');
      var colors = cardsController.get('colors');
      var legalities = cardsController.get('legalities');
      var types = cardsController.get('types');
      var nameSearch = cardsController.get('nameSearch');

      this.store.findQuery('card', {
        page: page,
        colors: colors,
        legalities: legalities,
        types: types,
        nameSearch: nameSearch
      }).then(function (cards) {
        cardsController.set('model', cards);
      });
    }
  }
});
