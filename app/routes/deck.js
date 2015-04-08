import Ember from 'ember';

export default Ember.Route.extend({
  model: function (params) {
    if (params.deck_id === 'new') {
      return this.store.createRecord('deck');
    } else {
      return this._super.apply(this, arguments);
    }
  },

  /** Make sure all the cards for the deck are loaded before continuing */
  afterModel: function (deck) {
    var cardPromiseArray = [];

    deck.get('cardGroups').forEach(function (cardGroup) {
      cardPromiseArray.push(cardGroup.get('card'));
    });

    return Ember.RSVP.all(cardPromiseArray);
  },

  actions: {
    saveDeck: function (deck) {
      var self = this;
      if (!deck.get('owner')) {
        deck.set('owner', this.get('session.user'));
      }
      deck.save().then(function (deck) {
        self.transitionTo('deck.build', deck.get('id'));
      });
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
