import Ember from 'ember';

let GameCard = Ember.Object.extend({
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

  bootstrapId: Ember.on('init', function() {
    let id = this.get('id');
    this.set('id', id || GameCard.generateId());
  })
});

GameCard.reopenClass({
  LIBRARY: 'library',
  HAND: 'hand',
  GRAVEYARD: 'graveyard',
  EXILE: 'exile',
  BATTLEFIELD: 'battlefield',
  generateId() {
    return uuid.v4();
  }
});

export default GameCard;
