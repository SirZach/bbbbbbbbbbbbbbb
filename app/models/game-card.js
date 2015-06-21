import Ember from 'ember';

var GameCard = Ember.Object.extend({
  /** @property {String} Card identifier. */
  cardId: null,

  /** @property {Number} Sort order within the zone. */
  order: null,

  /** @property {Boolean} Is the card tapped? */
  isTapped: false,

  /** @property {String} 'hand', 'library', 'graveyard', 'exile', 'battlefield' */
  zone: 'library'
});

GameCard.reopenClass({
  LIBRARY: 'library',
  HAND: 'hand',
  GRAVEYARD: 'graveyard',
  EXILE: 'exile',
  BATTLEFIELD: 'battlefield'
});

export default GameCard;
