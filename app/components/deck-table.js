import Ember from 'ember';
import layout from '../templates/components/deck-table';

export default Ember.Component.extend({
  layout: layout,

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
    }
  }
});
