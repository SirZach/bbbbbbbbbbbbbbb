import $ from 'jquery';
import Ember from 'ember';
import layout from '../templates/components/game-card';
import GameCard from '../models/game-card';

let MAGNIFYING_GLASS_WIDTH = 250;
let MAGNIFYING_GLASS_HEIGHT = 250;
let MAGNIFIED_CARD_WIDTH = 250;
let MAGNIFIED_CARD_HEIGHT = 347.5;

export default Ember.Component.extend({
  layout,

  attributeBindings: ['draggable'],

  classNames: ['game-card-container'],

  classNameBindings: ['readOnly::cursor-move', 'increasedMargin'],

  /** @property {DS.Model GameCard} */
  gameCard: null,

  /** @property {DS.Model Card} */
  card: function() {
    let gameCardId = this.get('gameCard.cardId');
    let cards = this.get('cards');

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
    let scope = Ember.guidFor(this);
    $(document).on(`keydown.${scope}`, (event) => {
      if (event.which === 90) {
        Ember.run(() => {
          if (!this.get('isDestroyed')) {
            this.set('isZPressed', true);
          }
        });
      }
    });
    $(document).on(`keyup.${scope}`, (event) => {
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

  dragStart(event) {
    if (!this.get('readOnly')) {
      let gameCard = this.get('gameCard');
      let dragData = JSON.stringify({
        cardId: gameCard.get('cardId'),
        id: gameCard.get('id')
      });

      event.dataTransfer.setData('text/plain', dragData);
      this.sendAction('dragStarted');
    }
  },

  dragEnd(event) {
    if (!this.get('readOnly')) {
      this.sendAction('dragEnded');
    }
  },

  /** @property {Boolean} */
  isTapped: Ember.computed.alias('gameCard.isTapped'),

  click() {
    if (this.get('canTap') && !this.get('readOnly')) {
      this.sendAction('tap', this.get('gameCard'));
    }
  },

  setMagnifyBounds() {
    // Calculate the bounds of the image inside this element.
    let isTapped = this.get('isTapped');
    let $img = $(this.element).find('img');
    let magnifyMinX = $img.offset().left;
    let magnifyMaxX = $img.offset().left +
      (isTapped ? $img.height() : $img.width());
    let magnifyMinY = $img.offset().top;
    let magnifyMaxY = $img.offset().top +
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
    let mouseX = event.clientX;
    let mouseY = event.clientY;
    let magnifyMinX = this.get('magnifyMinX');
    let magnifyMaxX = this.get('magnifyMaxX');
    let magnifyMinY = this.get('magnifyMinY');
    let magnifyMaxY = this.get('magnifyMaxY');
    if (mouseX < magnifyMinX ||
        mouseX > magnifyMaxX ||
        mouseY < magnifyMinY ||
        mouseY > magnifyMaxY) {
      this.destroyMagnifiedCardElement();
      return;
    } else {
      this.createMagnifiedCardElement();
    }
    let isTapped = this.get('isTapped');
    let settings = { isTapped };

    // Top and left coordinates for the placement of the magnifying glass.
    let left = mouseX - MAGNIFYING_GLASS_WIDTH / 2;
    let top = mouseY - MAGNIFYING_GLASS_HEIGHT / 2;
    settings.left = left;
    settings.top = top;

    // X and Y coordinates for the inner position of the background image. Note
    // that X and Y are rotated 90 degrees when the card is tapped.
    //
    let mouseRatioX, mouseRatioY;
    if (isTapped) {
      mouseRatioY = (mouseY - magnifyMinY) / 139;
      let tappedBackgroundX = -mouseRatioY * MAGNIFIED_CARD_HEIGHT +
        MAGNIFYING_GLASS_HEIGHT / 2;
      mouseRatioX = (mouseX - magnifyMinX) / 139;
      let tappedBackgroundY = mouseRatioX * MAGNIFIED_CARD_HEIGHT -
        MAGNIFIED_CARD_HEIGHT + MAGNIFYING_GLASS_WIDTH / 2;
      settings.x = tappedBackgroundX;
      settings.y = tappedBackgroundY;
    } else {
      mouseRatioX = (mouseX - magnifyMinX) / 100;
      let backgroundX = -mouseRatioX * MAGNIFIED_CARD_WIDTH +
        MAGNIFYING_GLASS_WIDTH / 2;
      mouseRatioY = (mouseY - magnifyMinY) / 139;
      let backgroundY = -mouseRatioY * MAGNIFIED_CARD_HEIGHT +
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
    let { id } = this.element;
    return `${id}-magnified`;
  }),

  createMagnifiedCardElement() {
    this.set('isMagnifying', true);
    let $el = this.get('$magnifiedCardElement');
    if ($el) {
      return;
    }
    let id = this.get('magnifiedCardElementId');
    let template = `<div id="${id}" class="game-card-magnify"></div>`;
    $('body').append(template);
    $el = $(`#${id}`);
    $el.css('background-image', `url("${this.get('card.imageUrl')}")`);

    // Save the element for future use.
    this.set('$magnifiedCardElement', $el);
  },

  destroyMagnifiedCardElement() {
    this.set('isMagnifying', false);
    let $el = this.get('$magnifiedCardElement');
    if ($el) {
      $el.remove();
      this.set('$magnifiedCardElement');
    }
  },

  updateMagnifiedCardElement({ top, left, x, y, isTapped }) {
    let $el = this.get('$magnifiedCardElement');
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
      let scope = Ember.guidFor(this);
      $(document).off(`keydown.${scope}`);
      $(document).off(`keyup.${scope}`);
    }
  }
});
