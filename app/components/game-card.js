import Ember from 'ember';
import layout from '../templates/components/game-card';

export default Ember.Component.extend({
  layout: layout,

  attributeBindings: ['draggable'],

  classNames: ['game-card'],

  classNameBindings: ['isTapped:tapped', 'readOnly::cursor-move', 'canTap'],

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

  /** @property {Boolean} do you own this card and is it in your battlefield */
  canTap: false,

  /** @property {Boolean} only interact with the cards if you're player one */
  readOnly: false,

  dragStart: function(event) {
    if (!this.get('readOnly')) {
      var gameCard = this.get('gameCard');
      var dragData = JSON.stringify({
        cardId: gameCard.get('cardId'),
        order: gameCard.get('order')
      });

      event.dataTransfer.setData('text/plain', dragData);
      this.sendAction('dragStarted');
    }
  },

  dragEnd: function (event) {
    if (!this.get('readOnly')) {
      this.sendAction('dragEnded');
    }
  },

  /** @property {Boolean} */
  isTapped: Ember.computed.alias('gameCard.isTapped'),

  click: function () {
    if (this.get('canTap') && !this.get('readOnly')) {
      this.sendAction('tap', this.get('gameCard'));
    }
  }
});
