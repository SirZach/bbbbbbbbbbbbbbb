import Ember from 'ember';
import layout from '../templates/components/deck-table-item';

export default Ember.Component.extend({
  layout: layout,

  tagName: '',

  /** @property {Boolean} - can this deck family be shown? */
  canShow: function () {
    var superType = this.get('family.superType'),
        doNotShowTypes = this.get('doNotShowTypes');

    return !doNotShowTypes.contains(superType);
  }.property('doNotShowTypes.@each', 'family'),

  actions: {
    showCard: function (card) {
      this.sendAction('showCard', card);
    },

    showHide: function (section) {
      this.sendAction('showHide', section);
    },

    hoverOn: function ($event, card) {
      this.sendAction('hoverOn', $event, card);
    },

    hoverOff: function ($event, card) {
      this.sendAction('hoverOff', $event, card);
    },

    remove: function (cardGroup) {
      this.sendAction('remove', cardGroup);
    },

    add: function (cardGroup) {
      this.sendAction('add', cardGroup);
    }
  }
});
