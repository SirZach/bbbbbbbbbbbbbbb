import Ember from 'ember';
import layout from '../templates/components/deck-table';

export default Ember.Component.extend({
  layout: layout,

  classNames: ['deck-table'],

  /**
   * @property {Array} List of hidden deck sections.
   * Instantiate per-component.
   */
  doNotShowTypes: null,

  init: function () {
    this._super.apply(this, arguments);
    this.set('doNotShowTypes', []);
  },

  canShowMainDeck: function () {
    return !this.get('doNotShowTypes').contains('mainDeck');
  }.property('doNotShowTypes.@each'),

  canShowSideDeck: function () {
    return !this.get('doNotShowTypes').contains('sideDeck');
  }.property('doNotShowTypes.@each'),

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
      var spoilerCardStyle = `top: ${offsetY}px;`;
      this.set('spoilerCardStyle', spoilerCardStyle);
      this.set('spoilerCard', card);
    },

    hoverOff: function ($event, card) {
      this.set('spoilerCard');
    }
  }
});
