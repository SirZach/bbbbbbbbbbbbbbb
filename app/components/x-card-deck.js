import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['row'],

  /** @property {Boolean} - can this card be added to the main deck being built */
  canAddToDeck: function () {
    var deck = this.get('deck');
    var currentCardName = this.get('card.name');

    return deck.canAddToDeck(currentCardName, 'main') &&
      deck.canAddToDeck(currentCardName, 'side');
  }.property('deck.cardGroups.@each.count', 'card'),

  /** @property {Boolean} - is this card not allowed to go in the main deck */
  cannotAddToDeck: Ember.computed.not('canAddToDeck'),

  /** @property {Boolean} - can this card be removed from the main deck */
  canRemoveFromMainDeck: function () {
    var currentCardName = this.get('card.name');
    var deck = this.get('deck');
    var cardGroup = deck.getCardGroup(currentCardName, 'main');

    return !!(cardGroup && cardGroup.count);
  }.property('deck.mainCardGroups.@each', 'card'),

  /** @property {Boolean} - is this card allowed to be removed from the main deck */
  cannotRemoveFromMainDeck: Ember.computed.not('canRemoveFromMainDeck'),

  /** @property {Boolean} - can this card be removed from the side deck */
  canRemoveFromSideDeck: function () {
    var currentCardName = this.get('card.name');
    var deck = this.get('deck');
    var cardGroup = deck.getCardGroup(currentCardName, 'side');

    return !!(cardGroup && cardGroup.count);
  }.property('deck.mainCardGroups.@each', 'card'),

  /** @property {Boolean} - can this card be removed from the side deck */
  cannotRemoveFromSideDeck: Ember.computed.not('canRemoveFromSideDeck'),

  /** @propert {Boolean} - can this card be removed from any deck */
  cannotRemoveFromAnyDeck: Ember.computed.and('cannotRemoveFromMainDeck', 'cannotRemoveFromSideDeck'),

  actions: {
    addToMain: function (card) {
      this.get('deck').addCard(card, 'main');
    },

    addToSide: function (card) {
      this.get('deck').addCard(card, 'side');
    },

    removeAllFromMain: function (card) {
      this.get('deck').removeAllCards('main');
    },

    removeOneFromMain: function (card) {
      this.get('deck').removeCard(card, 'main');
    },

    removeAllFromSide: function (card) {
      this.get('deck').removeAllCards('side');
    },

    removeOneFromSide: function (card) {
      this.get('deck').removeCard(card, 'side');
    }
  }
});
