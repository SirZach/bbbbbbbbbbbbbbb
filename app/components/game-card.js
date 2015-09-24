import $ from 'jquery';
import Ember from 'ember';
import layout from '../templates/components/game-card';
import GameCard from '../models/game-card';

var MAGNIFYING_GLASS_WIDTH = 250;
var MAGNIFYING_GLASS_HEIGHT = 250;
var MAGNIFIED_CARD_WIDTH = 250;
var MAGNIFIED_CARD_HEIGHT = 347.5;

export default Ember.Component.extend({
  layout: layout,

  attributeBindings: ['draggable'],

  classNames: ['game-card-container'],

  classNameBindings: ['readOnly::cursor-move', 'increasedMargin'],

  /** @property {DS.Model GameCard} */
  gameCard: null,

  /** @property {DS.Model Card} */
  card: function() {
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

  /** @property {Boolean} battle-field cards increase in margin to allow for tapping */
  increasedMargin: Ember.computed.equal('gameCard.zone', GameCard.BATTLEFIELD),

  /** Attach document key handlers for magnifying purposes. */
  attachKeyHandlers: Ember.on('init', function() {
    var scope = Ember.guidFor(this);
    $(document).on(`keydown.${scope}`, event => {
      if (event.which === 90) {
        Ember.run(() => {
          if (!this.get('isDestroyed')) {
            this.set('isZPressed', true);
          }
        });
      }
    });
    $(document).on(`keyup.${scope}`, event => {
      if (event.which === 90) {
        Ember.run(() => {
          if (!this.get('isDestroyed')) {
            this.set('isZPressed', false);
            this.destroyMagnifiedCardElement();
          }
        });
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

  dragEnd: function(event) {
    if (!this.get('readOnly')) {
      this.sendAction('dragEnded');
    }
  },

  /** @property {Boolean} */
  isTapped: Ember.computed.alias('gameCard.isTapped'),

  click: function() {
    if (this.get('canTap') && !this.get('readOnly')) {
      this.sendAction('tap', this.get('gameCard'));
    }
  },

  setMagnifyBounds() {
    // Calculate the bounds of the image inside this element.
    var isTapped = this.get('isTapped');
    var $img = $(this.element).find('img');
    var magnifyMinX = $img.offset().left;
    var magnifyMaxX = $img.offset().left +
      (isTapped ? $img.height() : $img.width());
    var magnifyMinY = $img.offset().top;
    var magnifyMaxY = $img.offset().top +
      (isTapped ? $img.width() : $img.height());
    this.setProperties({
      magnifyMinX,
      magnifyMaxX,
      magnifyMinY,
      magnifyMaxY
    });
  },

  mouseMove(event) {
    // See if the 'Z' key is pressed.
    if (!this.get('isZPressed')) {
      this.destroyMagnifiedCardElement();
      return;
    } else {
      this.setMagnifyBounds();
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
      this.destroyMagnifiedCardElement();
      return;
    } else {
      this.createMagnifiedCardElement();
    }
    var isTapped = this.get('isTapped');
    var settings = {isTapped};

    // Top and left coordinates for the placement of the magnifying glass.
    var left = mouseX - MAGNIFYING_GLASS_WIDTH / 2;
    var top = mouseY - MAGNIFYING_GLASS_HEIGHT / 2;
    settings.left = left;
    settings.top = top;

    // X and Y coordinates for the inner position of the background image. Note
    // that X and Y are rotated 90 degrees when the card is tapped.
    //
    var mouseRatioX, mouseRatioY;
    if (isTapped) {
      mouseRatioY = (mouseY - magnifyMinY) / 139;
      var tappedBackgroundX = -mouseRatioY * MAGNIFIED_CARD_HEIGHT +
        MAGNIFYING_GLASS_HEIGHT / 2;
      mouseRatioX = (mouseX - magnifyMinX) / 139;
      var tappedBackgroundY = mouseRatioX * MAGNIFIED_CARD_HEIGHT -
        MAGNIFIED_CARD_HEIGHT + MAGNIFYING_GLASS_WIDTH / 2;
      settings.x = tappedBackgroundX;
      settings.y = tappedBackgroundY;
    } else {
      mouseRatioX = (mouseX - magnifyMinX) / 100;
      var backgroundX = -mouseRatioX * MAGNIFIED_CARD_WIDTH +
        MAGNIFYING_GLASS_WIDTH / 2;
      mouseRatioY = (mouseY - magnifyMinY) / 139;
      var backgroundY = -mouseRatioY * MAGNIFIED_CARD_HEIGHT +
        MAGNIFYING_GLASS_HEIGHT / 2;
      settings.x = backgroundX;
      settings.y = backgroundY;
    }

    this.updateMagnifiedCardElement(settings);
  },

  mouseLeave() {
    // Ensure we always exit magnifying mode when leaving the element.
    this.destroyMagnifiedCardElement();
  },

  /**
   * @property {String} Id for the magnified element. Based off the existing id
   * for uniqueness.
   */
  magnifiedCardElementId: Ember.computed(function() {
    var id = this.element.id;
    return id + '-magnified';
  }),

  createMagnifiedCardElement() {
    this.set('isMagnifying', true);
    var $el = this.get('$magnifiedCardElement');
    if ($el) {
      return;
    }
    var id = this.get('magnifiedCardElementId');
    var template = `<div id="${id}" class="game-card-magnify"></div>`;
    $('body').append(template);
    $el = $(`#${id}`);
    $el.css('background-image', `url("${this.get('card.imageUrl')}")`);

    // Save the element for future use.
    this.set('$magnifiedCardElement', $el);
  },

  destroyMagnifiedCardElement() {
    this.set('isMagnifying', false);
    var $el = this.get('$magnifiedCardElement');
    if ($el) {
      $el.remove();
      this.set('$magnifiedCardElement');
    }
  },

  updateMagnifiedCardElement({top, left, x, y, isTapped}) {
    var $el = this.get('$magnifiedCardElement');
    if ($el) {
      $el.css({
        top: `${top}px`,
        left: `${left}px`,
        'background-position-x': `${x}px`,
        'background-position-y': `${y}px`
      });
      if (isTapped) {
        $el.addClass('tapped');
      } else {
        $el.removeClass('tapped');
      }
    }
  },

  actions: {
    /** Clean up key handlers. */
    willDestroyElement() {
      this.destroyMagnifiedCardElement();
      var scope = Ember.guidFor(this);
      $(document).off(`keydown.${scope}`);
      $(document).off(`keyup.${scope}`);
    }
  }
});
