import Ember from 'ember';

export default Ember.Route.extend({
  beforeModel() {
    if (!this.get('session.isAuthenticated')) {
      this.replaceWith('/');
    }

    let cardsController = this.controllerFor('cards');
    return this.store.findAll('card').then(function(cards) {
      cardsController.set('model', cards);
      // A hack to not show the spinner. Not sure it even makes sense to show
      // this subset of cards on load.
      //
      cardsController.set('model.reachedInfinity', true);
      return;
    });
  },

  model(params) {
    if (params.deck_id === 'new') {
      let deck = this.store.createRecord('deck');
      return this.get('session.user').then((user) => {
        deck.set('owner', user);
        return deck;
      });
    } else {
      return this._super.apply(this, arguments);
    }
  },

  /** Make sure all the cards for the deck are loaded before continuing */
  afterModel(deck) {
    let cardPromiseArray = [];

    deck.get('cardGroups').forEach(function(cardGroup) {
      cardPromiseArray.push(cardGroup.get('card'));
    });

    return Ember.RSVP.all(cardPromiseArray);
  },

  /** Get the default image url for the deck and set it as the imageUrl. */
  applyDefaultImageUrlToDeck(deck) {
    let buildController = this.controllerFor('deck.build');
    let imageUrl = buildController.get('defaultImageUrl');
    deck.set('imageUrl', imageUrl);
  },

  actions: {
    addToMain(card) {
      this.get('controller.model').addCard(card, 'main');
    },

    addToSide(card) {
      this.get('controller.model').addCard(card, 'side');
    },

    saveDeck(deck) {
      this.applyDefaultImageUrlToDeck(deck);

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

    showCard(card) {
      this.controllerFor('deck.build').set('nameSearch', card.get('name'));
    },

    typesChanged() {
      this.send('getNewCards');
    },

    colorsChanged() {
      this.send('getNewCards');
    },

    legalitiesChanged() {
      this.send('getNewCards');
    }
  }
});
