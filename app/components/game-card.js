import Ember from 'ember';
import layout from '../templates/components/game-card';

export default Ember.Component.extend({
  layout: layout,

  classNames: 'game-card',

  /** @property {DS.Model GameCard} */
  gameCard: null,

  /** @property {DS.Model Card} */
  card: function () {
    var gameCardId = this.get('gameCard.cardId');
    var cards = this.get('cards');

    return cards ? cards.findBy('id', gameCardId) : null;
  }.property('cards', 'gameCard.cardId'),

  /** @property {Array<DS.Model Card>} */
  cards: []
});
