import Ember from 'ember';
import DS from 'ember-data';
import SpecialCards from 'webatrice/utils/special-cards';

/**
 * Represents a collection of CardGroups.
 */
var CardFamily = Ember.Object.extend({
  /** @property {Boolean} */
  isMain: null,

  /** @property {String} - e.g. Creature */
  type: null,

  /** @property {CardGroup} - cards within this family */
  cardGroups: null,

  /** @property {Number} - sum of all cards in each group */
  totalCount: function () {
    return this.get('cardGroups').reduce(function (prev, curr) {
      return prev + curr.count;
    }, 0);
  }.property('cardGroups')
});

/**
 * Creates a computed property to calculate a certain type of legality.
 *
 * @return {Ember.computed}
 */
function computeIsLegal(style) {
  style = 'is' + style.capitalize();
  return function () {
    return this.get('cardGroups').isEvery('card.' + style);
  }.property('cardGroups.@each.card.' + style);
}

var Deck = DS.Model.extend({
  /** @property {User} - owner of the deck */
  owner: DS.belongsTo('user'),

  /** @property {String} - the deck name */
  name: DS.attr('string'),

  /** @property {String} - user defined comments about the deck */
  comments: DS.attr('string'),

  /** @property {Array[CardGroup]} - individual card multiples */
  cardGroups: DS.hasMany('cardGroup', {embedded: true}),

  /** @property {Array[CardGroups]} - card groups only in the main board */
  mainCardGroups: Ember.computed.filterBy('cardGroups', 'board', 'main'),

  /** @property {Number} - number of cards in the main board */
  mainCount: Ember.computed.sum('_mainCardGroupLengths'),
  _mainCardGroupLengths: Ember.computed.mapBy('mainCardGroups', 'count'),

  /** @property {Array[CardGroups]} - card groups only in the sideboard */
  sideCardGroups: Ember.computed.filterBy('cardGroups', 'board', 'side'),

  /** @property {Number} - number of cards in the sideboard */
  sideCount: Ember.computed.sum('_sideCardGroupLengths'),
  _sideCardGroupLengths: Ember.computed.mapBy('sideCardGroups', 'count'),

  /** @property {Boolean} - true if the entire deck + sideboard is standard */
  isStandard: computeIsLegal('standard'),

  /** @property {Boolean} - true if the entire deck + sideboard is modern */
  isModern: computeIsLegal('modern'),

  /** @property {Boolean} - true if the entire deck + sideboard is legacy */
  isLegacy: computeIsLegal('legal'),

  /** @property {Boolean} - true if the entire deck + sideboard is vintage */
  isVintage: computeIsLegal('vintage'),

  /** @property {String} -  */
  classification: function () {
    var isStandard = this.get('isStandard'),
        isModern = this.get('isModern'),
        isLegacy = this.get('isLegacy'),
        isVintage = this.get('isVintage');

    if (this.get('cardGroups.length') === 0) {
      return '';
    }

    return isStandard ? 'Standard' : isModern ? 'Modern' : isLegacy ? 'Legacy' : isVintage ? 'Vintage' : 'Illegal';
  }.property('isStandard', 'isModern', 'isLegacy', 'isVintage'),

  /**
   * @property {Array[String]} - An array of all the different card types in the
   *                             main board.
   */
  mainCardTypes: function () {
    return this.get('mainCardGroups').mapBy('card.mainType').uniq();
  }.property('mainCardGroups.@each.card.mainType'),

  /**
   * @property {Array[CardObj]} - An array of families of cards in the main
   *                              board. E.g. one family for creatures, one for
   *                              lands, etc.
   */
  mainDeckFamilies: function () {
    var cardGroups = this.get('mainCardGroups');
    var cardTypes = this.get('mainCardTypes');
    var cardFamilies = cardTypes.map(function (cardType) {
          return CardFamily.create({
            isMain: true,
            type: cardType,
            cardGroups: cardGroups.filterBy('card.mainType', cardType)
          });
        });
    return cardFamilies;
  }.property('mainCardGroups.@each.card.mainType'),

  /**
   * @property {Array[String]} - An array of all the different card types in the
   *                             sideboard.
   */
  sideCardTypes: function () {
    return this.get('sideCardGroups').mapBy('card.mainType').uniq();
  }.property('sideCardGroups.@each.card.mainType'),

  /**
   * @property {Array[CardObj]} - An array of families of cards in the side-
   *                              board. E.g. one family for creatures, one for
   *                              lands, etc.
   */
  sideDeckFamilies: function () {
    var cardGroups = this.get('sideCardGroups');
    var cardTypes = this.get('sideCardTypes');
    var cardFamilies = cardTypes.map(function (cardType) {
          return CardFamily.create({
            isMain: false,
            type: cardType,
            cardGroups: cardGroups.filterBy('card.mainType', cardType)
          });
        });
    return cardFamilies;
  }.property('sideCardGroups.@each.card.mainType'),

  /**
   * Is it legal to add another of these cards to the deck?
   *
   * @param {String} name - name of a card
   * @param {String} board - 'main', 'side'
   *
   * @return {Boolean}
   */
  canAddToDeck: function (name, board) {
    if (SpecialCards.BASIC_LANDS.contains(name) ||
        SpecialCards.MORE_THAN_FOUR_LEGAL.contains(name)) {
      return true;
    }

    var cardGroup = this.getCardGroup(name, board);
    if (!cardGroup) {
      return true;
    }

    return cardGroup.count < 4;
  },

  /**
   * Get a card group by its card and board name.
   *
   * @param {String} name - name of a card
   * @param {String} board - 'main', 'side'
   *
   * @return {CardGroup|null}
   */
  getCardGroup: function (name, board) {
    debugger;
    var cardGroups = this.get(board + 'CardGroups');
    return cardGroups.filterBy('card.name', name)[0];
  },

  /**
   * Add a card to the designated board if possible.
   *
   * @param {Card} card
   * @param {String} board - 'main', 'side'
   */
  addCard: function (card, board) {
    debugger;
    var cardGroup;
    if (this.canAddToDeck(card.get('name'), board)) {
      cardGroup = getCardGroup(card.get('name'), board);
      if (!cardGroup) {
        cardGroup = this.store.create('cardGroup', {
          board: board,
          count: 0,
          card: card
        });
        this.get('cardGroups').pushObject(cardGroup);
      }
      cardGroup.incrementProperty('count');
    }
  },

  /**
   * Remove a card from the designated board if possible.
   *
   * @param {Card} card
   * @param {String} board - 'main', 'side'
   */
  removeCard: function (card, board) {
    debugger;
    var cardGroup;
    cardGroup = getCardGroup(card.get('name'), board);
    if (!cardGroup) {
      cardGroup.decrementProperty('count');
      if (cardGroup.get('count') === 0) {
        this.get('cardGroups').removeObject(cardGroup);
      }
    }
  },

  /**
   * Remove all cards from the designated board.
   *
   * @param {String} board - 'main', 'side'
   */
  removeAllCards: function (board) {
    var toRemove = this.get(board + 'CardGroups');
    var cardGroups = this.get('cardGroups');
    toRemove.forEach(function (cardGroup) {
      cardGroups.removeObject(cardGroup);
    });
  }

  /** @property {String} - a string representation of the deck that Cockatrice knows how to parse and import */
  // exportFormat: function () {
  //   var mainDeckGroupings = this.get('mainDeckGroupings'),
  //       sideDeckGroupings = this.get('sideDeckGroupings'),
  //       exp = '';

  //   mainDeckGroupings.forEach(function (group) {
  //     group.cardObjs.forEach(function (cardObj) {
  //       exp += cardObj.count + ' ' + cardObj.card.get('name') + '\n';
  //     });
  //   });

  //   sideDeckGroupings.forEach(function (group) {
  //     group.cardObjs.forEach(function (cardObj) {
  //       exp += 'SB: ' + cardObj.count + ' ' + cardObj.card.get('name') + '\n';
  //     });
  //   });

  //   return exp;
  // }.property('mainDeckGroupings.@each', 'sideDeckGroupings.@each'),

  /** @property {Number} - the total number of unique cards in the deck and sideboard */
  // numberOfUniqueCardsInDeck: function () {
  //   return this.get('cards').uniq().length + this.get('sideboard').uniq().length;
  // }.property('cards.@each', 'sideboard.@each')
});

/**
Deck.reopenClass({
  createDeck: function (deckContents, cards) {
    var mainDeckCards = [],
        sideboard = [],
        deckCards = deckContents.split('\n');

    deckCards.forEach(function (dC) {
      var numberOfCards = dC.match(/\d+/)[0],
          cardName = dC.substring(dC.indexOf(numberOfCards) + 1).trim(),
          i;

      if (dC.indexOf("SB:") > -1) { //we're inspecting a sideboard
        for (i = 0; i < numberOfCards; i++) {
          sideboard.push(cards.findBy('name', cardName));
        }
      } else { //maindeck card
        for (i = 0; i < numberOfCards; i++) {
          mainDeckCards.push(cards.findBy('name', cardName));
        }
      }
    });

    return Deck.create({
      id: 'tmp',
      cards: mainDeckCards,
      sideboard: sideboard
    });
  }
});
*/
export default Deck;
