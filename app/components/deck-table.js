import Ember from 'ember';
import layout from '../templates/components/deck-table';

export default Ember.Component.extend({
  layout: layout,

  classNames: ['deck-table'],

  /**
   * @property {Array} List of hidden deck sections.
   * Instantiate per component.
   */
  doNotShowTypes: null,

  initNoShowTypes: function () {
    this.set('doNotShowTypes', []);
  }.on('init'),

  canShowMainDeck: function () {
    return !this.get('doNotShowTypes').contains('mainDeck');
  }.property('doNotShowTypes.[]'),

  canShowSideDeck: function () {
    return !this.get('doNotShowTypes').contains('sideDeck');
  }.property('doNotShowTypes.[]'),

  /** @property {Boolean} Render spoiler on left side? */
  isSpoilerOpposite: function () {
    return this.get('spoilerPosition') === 'left';
  }.property('spoilerPosition'),

  actions: {
    showHide: function (superType) {
      var doNotShowTypes = this.get('doNotShowTypes');

      if (doNotShowTypes.contains(superType)) {
        doNotShowTypes.removeAt(doNotShowTypes.indexOf(superType));
      } else {
        doNotShowTypes.pushObject(superType);
      }
    },

    showCard: function (card) {
      this.sendAction('showCard', card);
    },

    hoverOn: function ($event, card) {
      var $element = Ember.$(this.element);
      var minY = 10;
      var maxY = $element.height() - 325;
      var $target = Ember.$($event.currentTarget);
      var offsetY = $target.position().top;
      offsetY -= (160 - $target.height() / 2);
      offsetY = Math.max(minY, offsetY);
      offsetY = Math.min(maxY, offsetY);
      var spoilerCardStyle =
        new Ember.Handlebars.SafeString(`top: ${offsetY}px;`);

      // Calculate where to put the arrow such that it points at the midpoint of
      // the row hovered. 6 is half the height of the arrow.
      var rowMidpoint = $target.position().top + $target.height() / 2 - 6;
      var spoilerCardPointerStyle =
        new Ember.Handlebars.SafeString(`top: ${rowMidpoint}px;`);
      this.set('spoilerCardStyle', spoilerCardStyle);
      this.set('spoilerCardPointerStyle', spoilerCardPointerStyle);
      this.set('spoilerCard', card);
    },

    hoverOff: function ($event, card) {
      this.set('spoilerCard');
    },

    remove: function (cardGroup) {
      this.get('deck').removeCard(cardGroup.get('card'), cardGroup.get('board'));
    },

    add: function (cardGroup) {
      this.get('deck').addCard(cardGroup.get('card'), cardGroup.get('board'));
    }
  }
});
