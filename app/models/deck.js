import Ember from 'ember';

function groupByName (prev, curr) {
  var cardObj = prev.findBy('card.name', curr.get('name'));

  if (cardObj) {
    cardObj.count++;
  } else {
    prev.push({
      count: 1,
      card: curr
    });
  }

  return prev;
}

var CardObj = Ember.Object.extend({
  numberOf: function () {
    return this.get('cardObjs').reduce(function (prev, curr) {
      return prev + curr.count;
    }, 0);
  }.property('cardObjs'),

  superType: function () {
    return this.get('isMain') ? 'main' + this.get('type') : 'side' + this.get('type');
  }.property('isMain', 'type')
});

var Deck = Ember.Object.extend({
  /** @property {String} - the deck name */
  name: null,

  /** @property {String} - user defined comments about the deck */
  comments: null,

  /** @property {Array[Card]} - an array of Cards that make up the main deck */
  cards: [],

  /** @property {Array[Card]} - an array of Cards that make up the sideboard */
  sideboard: [],

  /** @property {Boolean} - true if the entire deck + sideboard is standard */
  isStandard: function () {
    var cards = this.get('cards'),
        sideboard = this.get('sideboard');

    function isStandard (card) {
      return card.get('isStandard');
    }

    return cards.every(isStandard) && sideboard.every(isStandard);
  }.property('cards.[]', 'sideboard.[]'),


  /** @property {Boolean} - true if the entire deck + sideboard is modern */
  isModern: function () {
    var cards = this.get('cards'),
        sideboard = this.get('sideboard');

    function isModern (card) {
      return card.get('isStandard') || card.get('isModern');
    }

    return cards.every(isModern) && sideboard.every(isModern);
  }.property('cards.[]', 'sideboard.[]'),

  /** @property {Boolean} - true if the entire deck + sideboard is legacy */
  isLegacy: function () {
    var cards = this.get('cards'),
        sideboard = this.get('sideboard');

    function isLegacy (card) {
      return card.get('isStandard') || card.get('isModern') || card.get('isLegacy');
    }

    return cards.every(isLegacy) && sideboard.every(isLegacy);
  }.property('cards.[]', 'sideboard.[]'),

  /** @property {Boolean} - not sure about this. can a deck not ever be at least vintage? */
  isVintage: true,

  /** @property {String} -  */
  classification: function () {
    var isStandard = this.get('isStandard'),
        isModern = this.get('isModern'),
        isLegacy = this.get('isLegacy');

    if (!this.get('cards.length') && !this.get('sideboard.length')) {
      return '';
    }

    return isStandard ? 'Standard' : isModern ? 'Modern' : isLegacy ? 'Legacy' : 'Vintage';
  }.property('isStandard', 'isModern', 'isLegacy', 'isVintage'),

  /** @property {Array[String]} - an array of all the different main card types in the deck */
  cardTypes: function () {
    return this.get('cards').mapBy('mainType').uniq();
  }.property('cards.@each'),

  /** @property {Array[CardObj]} - an array of CardObj that populates the deck table */
  mainDeckGroupings: function () {
    var cards = this.get('cards'),
        cardTypes = this.get('cardTypes'),
        cardGroups = cardTypes.map(function (cT) {
          return CardObj.create({
            isMain: true,
            type: cT,
            cardObjs: cards.filterBy('mainType', cT).reduce(groupByName, [])
          });
        });

    return cardGroups;
  }.property('cards.@each'),

    /** @property {Array[String]} - an array of all the different main card types in the deck */
  sideCardTypes: function () {
    return this.get('sideboard').mapBy('mainType').uniq();
  }.property('sideboard.@each'),

  /** @property {Array[CardObj]} - an array of CardObj that populates the deck table */
  sideDeckGroupings: function () {
    var cards = this.get('sideboard'),
        cardTypes = this.get('sideCardTypes'),
        cardGroups = cardTypes.map(function (cT) {
          return CardObj.create({
            isMain: false,
            type: cT,
            cardObjs: cards.filterBy('mainType', cT).reduce(groupByName, [])
          });
        });

    return cardGroups;
  }.property('sideboard.@each'),

  /** @property {String} - a string representation of the deck that Cockatrice knows how to parse and import */
  exportFormat: function () {
    var mainDeckGroupings = this.get('mainDeckGroupings'),
        sideDeckGroupings = this.get('sideDeckGroupings'),
        exp = '';

    mainDeckGroupings.forEach(function (group) {
      group.cardObjs.forEach(function (cardObj) {
        exp += cardObj.count + ' ' + cardObj.card.get('name') + '\n';
      });
    });

    sideDeckGroupings.forEach(function (group) {
      group.cardObjs.forEach(function (cardObj) {
        exp += 'SB: ' + cardObj.count + ' ' + cardObj.card.get('name') + '\n';
      });
    });

    return exp;
  }.property('mainDeckGroupings.@each', 'sideDeckGroupings.@each'),

  /** @property {Number} - the total number of unique cards in the deck and sideboard */
  numberOfUniqueCardsInDeck: function () {
    return this.get('cards').uniq().length + this.get('sideboard').uniq().length;
  }.property('cards.@each', 'sideboard.@each')
});

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
export default Deck;
