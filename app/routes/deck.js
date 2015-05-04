import Ember from 'ember';

export default Ember.Route.extend({
  beforeModel: function () {
    if (!this.get('session.isAuthenticated')) {
      this.replaceWith('/');
    }

    var cardsController = this.controllerFor('cards');
    return this.store.find('card').then(function (cards) {
      cardsController.set('model', cards);
      return;
    });
  },

  model: function (params) {
    if (params.deck_id === 'new') {
      var deck = this.store.createRecord('deck');
      return this.get('session.user').then((user) => {
        deck.set('owner', user);
        return deck;
      });
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
      this.get('session.user').then((user) => {
        deck.save()
          .then(() => user.get('decks'))
          .then((decks) => {
            decks.addObject(deck);
            return user.save();
          })
          .then(() => {
            this.replaceWith('deck.build', deck.get('id'));
            this.notifications.addNotification({
              message: 'Saved',
              type: 'success',
              autoClear: true,
              clearDuration: 1200
            });
          })
          .catch(() => {
            this.notifications.addNotification({
              message: 'Error',
              type: 'error'
            });
            deck.rollback();
          });
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
