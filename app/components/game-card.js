import Ember from 'ember';
import layout from '../templates/components/game-card';

var MAGNIFYING_GLASS_WIDTH = 250;
var MAGNIFYING_GLASS_HEIGHT = 250;
var MAGNIFIED_CARD_WIDTH = 250;
var MAGNIFIED_CARD_HEIGHT = 347.5;

export default Ember.Component.extend({
  layout: layout,

  attributeBindings: ['draggable'],

  classNames: ['game-card'],

  classNameBindings: ['isTapped:tapped', 'readOnly::cursor-move'],

  /** @property {DS.Model GameCard} */
  gameCard: null,

  /** @property {DS.Model Card} */
  card: function () {
    var gameCardId = this.get('gameCard.cardId');
    var cards = this.get('cards');

    return cards ? cards.findBy('id', gameCardId) : null;
  }.property('cards.@each.cardId', 'gameCard.cardId'),

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
        id: gameCard.get('id')
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
  },

  mouseEnter: function (event) {
    // Calculate the bounds.
    var $img = $(event.target);
    this.set('magnifyMinX', $img.offset().left);
    this.set('magnifyMaxX', $img.offset().left + $img.width());
    this.set('magnifyMinY', $img.offset().top);
    this.set('magnifyMaxY', $img.offset().top + $img.height());
    this.set('isMagnifying', true);
  },

  mouseMove: function (event) {
    // See if we are still over the image.
    var mouseX = event.clientX;
    var mouseY = event.clientY;
    var magnifyMinX = this.get('magnifyMinX');
    var magnifyMaxX = this.get('magnifyMaxX');
    var magnifyMinY = this.get('magnifyMinY');
    var magnifyMaxY = this.get('magnifyMaxY');
    if (mouseX < magnifyMinX ||
        mouseX > magnifyMaxX ||
        mouseY < magnifyMinY ||
        mouseY > magnifyMaxY) {
      this.set('isMagnifying', false);
      return;
    }
    // Top and left coordinates for the placement of the magnifying glass.
    var left = mouseX - MAGNIFYING_GLASS_WIDTH / 2;
    var top = mouseY - MAGNIFYING_GLASS_HEIGHT / 2;
    this.set('magnifyLeft', left);
    this.set('magnifyTop', top);

    // X and Y coordinates for the inner position of the background image.
    var backgroundX = -((mouseX - magnifyMinX) / 100) * MAGNIFIED_CARD_WIDTH + MAGNIFYING_GLASS_WIDTH / 2;
    var backgroundY = -((mouseY - magnifyMinY) / 139) * MAGNIFIED_CARD_HEIGHT + MAGNIFYING_GLASS_HEIGHT / 2;
    this.set('magnifyX', backgroundX);
    this.set('magnifyY', backgroundY);
  },

  mouseLeave: function () {
    this.set('isMagnifying', false);
  }
});
