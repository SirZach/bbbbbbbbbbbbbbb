import $ from 'jquery';
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

  /** Attach document key handlers for magnifying purposes. */
  attachKeyHandlers: Ember.on('init', function () {
    var scope = Ember.guidFor(this);
    $(document).on(`keydown.${scope}`, event => {
      if (event.which === 90) {
        this.set('isZPressed', true);
      }
    });
    $(document).on(`keyup.${scope}`, event => {
      if (event.which === 90) {
        this.set('isZPressed', false);
        this.set('isMagnifying', false);
      }
    });
  }),

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

  didInsertElement() {
    // Calculate the bounds of the image inside this element.
    var $img = $(this.element).find('img');
    this.set('magnifyMinX', $img.offset().left);
    this.set('magnifyMaxX', $img.offset().left + $img.width());
    this.set('magnifyMinY', $img.offset().top);
    this.set('magnifyMaxY', $img.offset().top + $img.height());
  },

  mouseMove(event) {
    // See if the 'Z' key is pressed.
    if (!this.get('isZPressed')) {
      this.set('isMagnifying', false);
      return;
    }
    // See if we are over the image.
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
    } else {
      this.set('isMagnifying', true);
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

  mouseLeave() {
    // Ensure we always exit magnifying mode when leaving the element.
    this.set('isMagnifying', false);
  },

  actions: {
    /** Clean up key handlers. */
    willDestroyElement() {
      var scope = Ember.guidFor(this);
      $(document).off(`keydown.${scope}`);
      $(document).off(`keyup.${scope}`);
    }
  }
});
