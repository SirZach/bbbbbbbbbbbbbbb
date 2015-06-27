import Ember from 'ember';

var GameCard = Ember.Object.extend({
  /** @property {String} Card identifier. */
  cardId: null,

  /** @property {Number} Sort order within the zone. */
  order: null,

  /** @property {Boolean} Is the card tapped? */
  isTapped: false,

  /** @property {String} 'hand', 'library', 'graveyard', 'exile', 'battlefield' */
  zone: 'library',

  /** @property {Boolean} if the game-card is a token, it doesn't have a cardId */
  isToken: false,

  /** @property {Object} object containing name, power, toughness, and description */
  tokenStats: null,

  bootstrapId: Ember.on('init', function () {
    this.set('id', GameCard.generateId());
  })
});

GameCard.reopenClass({
  LIBRARY: 'library',
  HAND: 'hand',
  GRAVEYARD: 'graveyard',
  EXILE: 'exile',
  BATTLEFIELD: 'battlefield',
  _idSequence: 0,
  generateId() {
    return GameCard._idSequence++;
  }
});

export default GameCard;
