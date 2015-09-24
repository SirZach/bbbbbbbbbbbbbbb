import Ember from 'ember';
import layout from '../templates/components/deck-table-item';

const { Component, computed } = Ember;

export default Component.extend({
  layout,

  tagName: '',

  /** @public @property {Boolean} - can this deck family be shown? */
  canShow: computed('doNotShowTypes.[]', 'family', function() {
    let superType = this.get('family.superType');
    let doNotShowTypes = this.get('doNotShowTypes');

    return !doNotShowTypes.contains(superType);
  }),

  actions: {
    showCard(card) {
      this.sendAction('showCard', card);
    },

    showHide(section) {
      this.sendAction('showHide', section);
    },

    hoverOn($event, card) {
      this.sendAction('hoverOn', $event, card);
    },

    hoverOff($event, card) {
      this.sendAction('hoverOff', $event, card);
    },

    remove(cardGroup) {
      this.sendAction('remove', cardGroup);
    },

    add(cardGroup) {
      this.sendAction('add', cardGroup);
    }
  }
});
