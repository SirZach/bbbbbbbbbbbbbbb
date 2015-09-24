import Ember from 'ember';
import layout from '../templates/components/lil-card-stack';

export default Ember.Component.extend({
  layout: layout,

  classNames: ['lil-card-stack'],

  /**
   * Handles the mouse/focus enter event for showing the related card image.
   */
  mouseEnter: function() {
    let card = this.get('cardGroup.card');
    this.sendAction('cardFocusIn', card);
  },

  /**
   * Handles the mouse/focus leave event for hiding the related card image.
   */
  mouseLeave: function() {
    let card = this.get('cardGroup.card');
    this.sendAction('cardFocusOut', card);
  },

  /** @property {Array<Card>} a list of card copies (identical cards) */
  copies: function() {
    let card = this.get('cardGroup.card');
    let count = this.get('cardGroup.count');
    let zIndex = this.get('startingZIndex');
    let copies = [];
    for (let i = 0; i < count; i++) {
      copies.pushObject(Ember.Object.create({
        card,
        zIndex: zIndex--
      }));
    }
    return copies;
  }.property('cardGroup.card.name', 'cardGroup.count'),

  /** @property {Number} the number of cards in all related card groups */
  totalCardsInCardGroups: function() {
    return this.get('cardGroups')
      .mapBy('count')
      .reduce((acc, cur) => { return acc + cur; }, 0);
  }.property('cardGroups.@each.count'),

  /** @property {Number} the z-index to start at for proper overlapping */
  startingZIndex: function() {
    let totalCardsInCardGroups = this.get('totalCardsInCardGroups');
    let cardGroups = this.get('cardGroups');
    let thisCardGroup = this.get('cardGroup');
    let cardGroupIndex = 0;
    let cardGroup = cardGroups[cardGroupIndex];
    let startingZIndex = totalCardsInCardGroups;
    while (cardGroup !== thisCardGroup) {
      startingZIndex -= cardGroup.get('count');
      cardGroup = cardGroups[++cardGroupIndex];
    }
    return startingZIndex;
  }.property('totalCardsInCardGroups')
});
