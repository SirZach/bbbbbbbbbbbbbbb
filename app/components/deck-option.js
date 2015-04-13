import Ember from 'ember';
import layout from '../templates/components/deck-option';

export default Ember.Component.extend({
  layout: layout,
  tagName: 'li',
  classNameBindings: [':deck-option', 'isSelected:deck-option-selected'],
  attributeBindings: ['style'],

  style: function () {
    return `background-image: url("${this.get('deck.defaultImageUrl')}")`;
  }.property('deck.defaultImageUrl'),

  /** @property {Boolean} Is this the selected deck? */
  isSelected: function () {
    return this.get('selectedDeckId') === this.get('deck.id');
  }.property('selectedDeckId', 'deck.id'),

  /** Respond to deck selection. */
  onSelect: function () {
    this.sendAction('action', this.get('deck'));
  }.on('click')
});
