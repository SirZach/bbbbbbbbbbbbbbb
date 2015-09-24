import Ember from 'ember';
import layout from '../templates/components/deck-option';

const { Component, computed } = Ember;

export default Component.extend({
  layout,
  tagName: 'li',
  classNameBindings: [':deck-option', 'isSelected:deck-option-selected'],
  attributeBindings: ['style'],

  style: computed('deck.defaultImageUrl', function() {
    return `background-image: url("${this.get('deck.defaultImageUrl')}")`;
  }),

  /** @public @property {Boolean} Is this the selected deck? */
  isSelected: computed('selectedDeckId', 'deckId', function() {
    return this.get('selectedDeckId') === this.get('deck.id');
  }),

  /**
    @public
    Respond to deck selection. */
  onSelect: function() {
    this.sendAction('action', this.get('deck'));
  }.on('click')
});
