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

  /** @property {String} - e.g. main-Creature */
  superType: function () {
    var isMain = this.get('isMain');
    var type = this.get('type');

    return isMain ? `main-${type}` : `side-${type}`;
  }.property('isMain', 'type'),

  /** @property {CardGroup} - cards within this family */
  cardGroups: null,

  /** @property {Number} - sum of all cards in each group */
  totalCount: function () {
    return this.get('cardGroups').reduce(function (prev, curr) {
      return prev + curr.get('count');
    }, 0);
  }.property('cardGroups.@each.count')
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

  sortedCardGroups: Ember.computed.sort('cardGroups', function (a, b) {
    return a.get('card.name') < b.get('card.name') ? -1 : 1;
  }),

  /** @property {Array[CardGroups]} - card groups only in the main board */
  mainCardGroups: Ember.computed.filterBy('sortedCardGroups', 'board', 'main'),

  /** @property {Number} - number of cards in the main board */
  mainCount: Ember.computed.sum('_mainCardGroupLengths'),
  _mainCardGroupLengths: Ember.computed.mapBy('mainCardGroups', 'count'),

  /** @property {Array[CardGroups]} - card groups only in the sideboard */
  sideCardGroups: Ember.computed.filterBy('sortedCardGroups', 'board', 'side'),

  /** @property {Number} - number of cards in the sideboard */
  sideCount: Ember.computed.sum('_sideCardGroupLengths'),
  _sideCardGroupLengths: Ember.computed.mapBy('sideCardGroups', 'count'),

  /** @property {Number} - number of cards in the entire deck */
  allCount: function () {
    return this.get('sideCount') + this.get('mainCount');
  }.property('sideCount', 'mainCount'),

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

    return cardGroup.get('count') < 4;
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
    var cardGroups = this.get(board + 'CardGroups');
    return cardGroups.filterBy('card.name', name)[0];
  },

  /**
   * Add a card to the designated board if possible.
   *
   * @param {Card} card
   * @param {String} board - 'main', 'side'
   * @param {Number} count - (optional) number of cards to add
   */
  addCard: function (card, board, count) {
    var cardGroup;
    if (this.canAddToDeck(card.get('name'), board)) {
      cardGroup = this.getCardGroup(card.get('name'), board);
      if (!cardGroup) {
        cardGroup = this.store.createRecord('cardGroup', {
          board: board,
          count: 0,
          card: card
        });
        this.get('cardGroups').pushObject(cardGroup);
      }
      cardGroup.incrementProperty('count');
      if (--count) {
        this.addCard(card, board, count);
      }
    }
  },

  /**
   * Remove a card from the designated board if possible.
   *
   * @param {Card} card
   * @param {String} board - 'main', 'side'
   */
  removeCard: function (card, board) {
    var cardGroup;
    cardGroup = this.getCardGroup(card.get('name'), board);
    if (cardGroup) {
      cardGroup.decrementProperty('count');
      if (cardGroup.get('count') === 0) {
        this.get('cardGroups').removeObject(cardGroup);
      }
    }
  },

  /**
   * Remove all cards of the given type from the designated board.
   *
   * @param {Card} card
   * @param {String} board - 'main', 'side'
   */
  removeAllCards: function (card, board) {
    var cardGroups = this.get('cardGroups');
    var cardGroup = this.getCardGroup(card.get('name'), board);
    if (cardGroup) {
      cardGroups.removeObject(cardGroup);
    }
  },

  /** @property {String} - a string representation of the deck that Cockatrice knows how to parse and import */
  exportFormat: function () {
    var mainDeckFamilies = this.get('mainDeckFamilies');
    var sideDeckFamilies = this.get('sideDeckFamilies');
    var exp = '';

    mainDeckFamilies.forEach(function (family) {
      family.get('cardGroups').forEach(function (cardGroup) {
        exp += cardGroup.get('count');
        exp += ' ';
        exp += cardGroup.get('card.name');
        exp += '\n';
      });
    });

    sideDeckFamilies.forEach(function (family) {
      family.get('cardGroups').forEach(function (cardGroup) {
        exp += 'SB: ';
        exp += cardGroup.get('count');
        exp += ' ';
        exp += cardGroup.get('card.name');
        exp += '\n';
      });
    });

    return exp;
  }.property('cardGroups.@each.count'),

  /** @property {Number} - the total number of unique cards in the main and sideboard */
  numberOfUniqueCardsInDeck: function () {
    var mainCardGroups = this.get('mainCardGroups');
    var sideCardGroups = this.get('sideCardGroups');
    return mainCardGroups.get('length') + sideCardGroups.get('length');
  }.property('cardGroups.@each'),

  /** @property {Boolean} - is this deck game-ready? */
  isGameReady: Ember.computed.gte('mainCount', 60),

  /** @property {String} - default image url; uses a card in the deck */
  defaultImageUrl: function () {
    var cardGroups = this.get('mainCardGroups');
    return cardGroups.filterBy('card.mainType', 'Creature')
      .sortBy('card.cmc')
      .get('lastObject.card.imageUrl');
  }.property('mainCardGroups.@each.cmc')
});

Deck.reopenClass({
  /**
   * Create a deck from the given textual input.
   *
   * @param {String} import - text form deck
   * @param {Store} store - store in which to create this deck
   *
   * @return {Promise} - Resolves with {deck: Deck, errors: String[]}
   */
  createFromImport: function (importText, store) {
    var deck = store.createRecord('deck');

    // Flag for indicating all further cards should belong to the sideboard.
    // Sideboarded cards are either each preceeded by "SB: " (Cockatrice style)
    // or by a "Sideboard:" line (Tapped Out style).
    var sideboardReached = false;
    var lines = importText.split('\n');
    var errors = [];
    var promises = [];
    lines.forEach(function (line) {
      try {
        line = line.trim();
        if (!line.length) {
          return;
        }
        if (/^sideboard:/i.test(line)) {
          sideboardReached = true;
          return;
        }

        var board = sideboardReached || /^SB: /.test(line) ? 'side' : 'main';

        // Regex description:
        // Match an optional "SB: " string at the beginning.
        // Match a number for card quantity.
        // Allow an optional "x" after the number.
        // Look for at least one whitespace character.
        // match the rest of the line as the card name.
        //
        var options = /^(SB: )?(\d+)x?\s+(.+)$/.exec(line);
        var count = Number(options[options.length - 2]);
        if (isNaN(count)) {
          throw new Error(options[options.length - 2] + ' is not a number');
        }
        var name = options[options.length - 1];
        if (name.length === 0) {
          throw new Error('No card name specified');
        }
        promises.push(store.find('card', name).then(function (card) {
          deck.addCard(card, board, count);
        }, function () {
          // The card could not be found. Add to the error list.
          errors.push(line);
        }));
      } catch (error) {
        errors.push(line);
      }
    });
    return Ember.RSVP.all(promises).then(function () {
      return {
        deck: deck,
        errors: errors
      };
    });
  }
});

export default Deck;
