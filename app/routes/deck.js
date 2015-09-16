import Ember from 'ember';

export default Ember.Route.extend({
  beforeModel: function () {
    if (!this.get('session.isAuthenticated')) {
      this.replaceWith('/');
    }

    var cardsController = this.controllerFor('cards');
    return this.store.findAll('card').then(function (cards) {
      cardsController.set('model', cards);
      // A hack to not show the spinner. Not sure it even makes sense to show
      // this subset of cards on load.
      //
      cardsController.set('model.reachedInfinity', true);
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
    addToMain: function (card) {
      this.get('controller.model').addCard(card, 'main');
    },

    addToSide: function (card) {
      this.get('controller.model').addCard(card, 'side');
    },

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
      this.controllerFor('deck.build').set('nameSearch', card.get('name'));
    },

    typesChanged: function () {
      this.send('getNewCards');
    },

    colorsChanged: function () {
      this.send('getNewCards');
    },

    legalitiesChanged: function () {
      this.send('getNewCards');
    }
  }
});
