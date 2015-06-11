import Ember from 'ember';
import layout from '../templates/components/game-card';

export default Ember.Component.extend({
  layout: layout,

  attributeBindings: ['draggable'],

  classNames: ['game-card', 'cursor-move'],

  /** @property {DS.Model GameCard} */
  gameCard: null,

  /** @property {DS.Model Card} */
  card: function () {
    var gameCardId = this.get('gameCard.cardId');
    var cards = this.get('cards');

    return cards ? cards.findBy('id', gameCardId) : null;
  }.property('cards', 'gameCard.cardId'),

  /** @property {Array<DS.Model Card>} */
  cards: [],

  draggable: true,

  dragStart: function(event) {
    var gameCard = this.get('gameCard');

    event.dataTransfer.setData('text/data', gameCard.get('id'));
    this.sendAction('dragStarted');
  },

  dragEnd: function (event) {
    this.sendAction('dragEnded');
  }
});
