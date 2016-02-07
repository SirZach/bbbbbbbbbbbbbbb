import Ember from 'ember';
import DS from 'ember-data';
import SpecialCards from 'webatrice/utils/special-cards';
const { computed, get } = Ember;

/**
 * Represents a collection of CardGroups.
 */
let CardFamily = Ember.Object.extend({
  /** @property {Boolean} */
  isMain: null,

  /** @property {String} - e.g. Creature */
  type: null,

  /** @property {String} - e.g. main-Creature */
  superType: function() {
    let isMain = this.get('isMain');
    let type = this.get('type');

    return isMain ? `main-${type}` : `side-${type}`;
  }.property('isMain', 'type'),

  /** @property {CardGroup} - cards within this family */
  cardGroups: null,

  /** @property {Number} - sum of all cards in each group */
  totalCount: function() {
    return this.get('cardGroups').reduce(function(prev, curr) {
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
  let capitalizedStyle = style.capitalize();

  style = `is${capitalizedStyle}`;
  return function() {
    return this.get('cardGroups').isEvery(`card.${style}`);
  }.property(`cardGroups.@each.card.${style}`);
}

let Deck = DS.Model.extend({
  /** @property {User} - owner of the deck */
  owner: DS.belongsTo('user', { async: true }),

  /** @property {String} - the deck name */
  name: DS.attr('string'),

  /** @property {String} - url of the associated image */
  imageUrl: DS.attr('string'),

  /** @property {String} - user defined comments about the deck */
  comments: DS.attr('string'),

  /** @property {Array[CardGroup]} - individual card multiples */
  cardGroups: DS.hasMany('cardGroup', { async: false }),

  sortedCardGroups: Ember.computed.sort('cardGroups', function(a, b) {
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
  allCount: function() {
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
  classification: function() {
    let isStandard = this.get('isStandard');
    let isModern = this.get('isModern');
    let isLegacy = this.get('isLegacy');
    let isVintage = this.get('isVintage');

    if (this.get('cardGroups.length') === 0) {
      return '';
    }

    return isStandard ? 'Standard' : isModern ? 'Modern' : isLegacy ? 'Legacy' : isVintage ? 'Vintage' : 'Illegal';
  }.property('isStandard', 'isModern', 'isLegacy', 'isVintage'),

  /**
   * @property {Array[String]} - An array of all the different card types in the
   *                             main board.
   */
  mainCardTypes: function() {
    return this.get('mainCardGroups').mapBy('card.mainType').uniq();
  }.property('mainCardGroups.@each.card.mainType'),

  /**
   * @property {Array[CardObj]} - An array of families of cards in the main
   *                              board. E.g. one family for creatures, one for
   *                              lands, etc.
   */
  mainDeckFamilies: function() {
    let cardGroups = this.get('mainCardGroups');
    let cardTypes = this.get('mainCardTypes');
    let cardFamilies = cardTypes.map(function(cardType) {
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
  sideCardTypes: function() {
    return this.get('sideCardGroups').mapBy('card.mainType').uniq();
  }.property('sideCardGroups.@each.card.mainType'),

  /**
   * @property {Array[CardObj]} - An array of families of cards in the side-
   *                              board. E.g. one family for creatures, one for
   *                              lands, etc.
   */
  sideDeckFamilies: function() {
    let cardGroups = this.get('sideCardGroups');
    let cardTypes = this.get('sideCardTypes');
    let cardFamilies = cardTypes.map(function(cardType) {
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
  canAddToDeck(name, board) {
    if (SpecialCards.BASIC_LANDS.contains(name) ||
        SpecialCards.MORE_THAN_FOUR_LEGAL.contains(name)) {
      return true;
    }

    let cardGroup = this.getCardGroup(name, board);
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
  getCardGroup(name, board) {
    let cardGroups = this.getWithDefault(`${board}CardGroups`, []);
    return cardGroups.filterBy('card.name', name)[0];
  },

  /**
   * Add a card to the designated board if possible.
   *
   * @param {Card} card
   * @param {String} board - 'main', 'side'
   * @param {Number} count - (optional) number of cards to add
   */
  addCard(card, board, count) {
    let cardGroup = this.getCardGroup(card.get('name'), board);
    if (!cardGroup) {
      cardGroup = this.store.createRecord('card-group', {
        board,
        count: 0,
        card
      });
      this.get('cardGroups').pushObject(cardGroup);
    }
    cardGroup.incrementProperty('count');
    if (--count) {
      this.addCard(card, board, count);
    }
  },

  /**
   * Remove a card from the designated board if possible.
   *
   * @param {Card} card
   * @param {String} board - 'main', 'side'
   */
  removeCard(card, board) {
    let cardGroup;
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
  removeAllCards(card, board) {
    let cardGroups = this.get('cardGroups');
    let cardGroup = this.getCardGroup(card.get('name'), board);
    if (cardGroup) {
      cardGroups.removeObject(cardGroup);
    }
  },

  /** @property {String} - a string representation of the deck that Cockatrice knows how to parse and import */
  exportFormat: function() {
    let mainDeckFamilies = this.get('mainDeckFamilies');
    let sideDeckFamilies = this.get('sideDeckFamilies');
    let exp = '';

    mainDeckFamilies.forEach(function(family) {
      family.get('cardGroups').forEach(function(cardGroup) {
        exp += cardGroup.get('count');
        exp += ' ';
        exp += cardGroup.get('card.name');
        exp += '\n';
      });
    });

    sideDeckFamilies.forEach(function(family) {
      family.get('cardGroups').forEach(function(cardGroup) {
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
  numberOfUniqueCardsInDeck: function() {
    let mainCardGroups = this.get('mainCardGroups');
    let sideCardGroups = this.get('sideCardGroups');
    return mainCardGroups.get('length') + sideCardGroups.get('length');
  }.property('cardGroups.[]'),

  /** @property {Boolean} - is this deck game-ready? */
  isGameReady: Ember.computed.gt('mainCount', 0),

  imageUrlStyle: computed('imageUrl', function() {
    let imageUrl = get(this, 'imageUrl');
    return new Ember.Handlebars.SafeString(`background-image: url(${imageUrl})`);
  })
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
  createFromImport(importText, store) {
    let deck = store.createRecord('deck');

    // Flag for indicating all further cards should belong to the sideboard.
    // Sideboarded cards are either each preceeded by "SB: " (Cockatrice style)
    // or by a "Sideboard:" line (Tapped Out style).
    let sideboardReached = false;
    let lines = importText.split('\n');
    let errors = [];
    let promises = [];
    lines.forEach(function(line) {
      try {
        line = line.trim();
        if (!line.length) {
          return;
        }
        if (/^sideboard:/i.test(line)) {
          sideboardReached = true;
          return;
        }

        let board = sideboardReached || /^SB: /.test(line) ? 'side' : 'main';

        // Regex description:
        // Match an optional "SB: " string at the beginning.
        // Match a number for card quantity.
        // Allow an optional "x" after the number.
        // Look for at least one whitespace character.
        // match the rest of the line as the card name.
        //
        let options = /^(SB: )?(\d+)x?\s+(.+)$/.exec(line);
        let count = Number(options[options.length - 2]);
        if (isNaN(count)) {
          let nanMessage = options[options.length - 2];

          throw new Error(`${nanMessage} is not a number`);
        }
        let name = options[options.length - 1];
        if (name.length === 0) {
          throw new Error('No card name specified');
        }
        promises.push(store.find('card', name).then(function(card) {
          deck.addCard(card, board, count);
        }, function() {
          // The card could not be found. Add to the error list.
          errors.push(line);
        }));
      } catch (error) {
        errors.push(line);
      }
    });
    return Ember.RSVP.all(promises).then(function() {
      return {
        deck,
        errors
      };
    });
  }
});

export default Deck;
