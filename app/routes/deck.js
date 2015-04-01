import Ember from 'ember';

export default Ember.Route.extend({
  model: function () {
    return this.store.createRecord('deck');
  },

  actions: {
    saveDeck: function (deck) {
      deck.set('owner', this.get('session.currentUser.github.username'));
      deck.save();
    },

    showCard: function (card) {
      this.controllerFor('deck.build').set('selectedCard', card);
    },

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
