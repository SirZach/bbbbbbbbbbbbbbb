import Ember from 'ember';
import layout from '../templates/components/deck-table';

const { Component, computed } = Ember;

export default Component.extend({
  layout,

  classNames: ['deck-table'],

  /**
   * @public
   * @property {Array} List of hidden deck sections.
   * Instantiate per component.
   */
  doNotShowTypes: null,

  initNoShowTypes: function() {
    this.set('doNotShowTypes', []);
  }.on('init'),

  canShowMainDeck: computed('doNotShowTypes.[]', function() {
    return !this.get('doNotShowTypes').contains('mainDeck');
  }),

  canShowSideDeck: computed('doNotShowTypes.[]', function() {
    return !this.get('doNotShowTypes').contains('sideDeck');
  }),

  /** @public @property {Boolean} Render spoiler on left side? */
  isSpoilerOpposite: computed('spoilerPosition', function() {
    return this.get('spoilerPosition') === 'left';
  }),

  actions: {
    showHide(superType) {
      let doNotShowTypes = this.get('doNotShowTypes');

      if (doNotShowTypes.contains(superType)) {
        doNotShowTypes.removeAt(doNotShowTypes.indexOf(superType));
      } else {
        doNotShowTypes.pushObject(superType);
      }
    },

    showCard(card) {
      this.sendAction('showCard', card);
    },

    hoverOn($event, card) {
      let $element = Ember.$(this.element);
      let minY = 10;
      let maxY = $element.height() - 325;
      let $target = Ember.$($event.currentTarget);
      let offsetY = $target.position().top;
      offsetY -= (160 - $target.height() / 2);
      offsetY = Math.max(minY, offsetY);
      offsetY = Math.min(maxY, offsetY);
      let spoilerCardStyle =
        new Ember.Handlebars.SafeString(`top: ${offsetY}px;`);

      // Calculate where to put the arrow such that it points at the midpoint of
      // the row hovered. 6 is half the height of the arrow.
      let rowMidpoint = $target.position().top + $target.height() / 2 - 6;
      let spoilerCardPointerStyle =
        new Ember.Handlebars.SafeString(`top: ${rowMidpoint}px;`);
      this.set('spoilerCardStyle', spoilerCardStyle);
      this.set('spoilerCardPointerStyle', spoilerCardPointerStyle);
      this.set('spoilerCard', card);
    },

    hoverOff($event, card) {
      this.set('spoilerCard');
    },

    remove(cardGroup) {
      this.get('deck').removeCard(cardGroup.get('card'), cardGroup.get('board'));
    },

    add(cardGroup) {
      this.get('deck').addCard(cardGroup.get('card'), cardGroup.get('board'));
    }
  }
});
