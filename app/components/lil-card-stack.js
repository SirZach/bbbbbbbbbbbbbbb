import Ember from 'ember';
import layout from '../templates/components/lil-card-stack';

export default Ember.Component.extend({
  layout: layout,

  classNames: ['lil-card-stack'],

  /**
   * Handles the mouse/focus enter event for showing the related card image.
   */
  mouseEnter: function () {
    var card = this.get('cardGroup.card');
    this.sendAction('cardFocusIn', card);
  },

  /**
   * Handles the mouse/focus leave event for hiding the related card image.
   */
  mouseLeave: function () {
    var card = this.get('cardGroup.card');
    this.sendAction('cardFocusOut', card);
  },

  /** @property {Array<Card>} a list of card copies (identical cards) */
  copies: function () {
    var card = this.get('cardGroup.card');
    var count = this.get('cardGroup.count');
    var zIndex = this.get('startingZIndex');
    var copies = [];
    for (var i = 0; i < count; i++) {
      copies.pushObject(Ember.Object.create({
        card,
        zIndex: zIndex--
      }));
    }
    return copies;
  }.property('cardGroup.card.name', 'cardGroup.count'),

  /** @property {Number} the number of cards in all related card groups */
  totalCardsInCardGroups: function () {
    return this.get('cardGroups')
      .mapBy('count')
      .reduce((acc, cur) => { return acc + cur; }, 0);
  }.property('cardGroups.@each.count'),

  /** @property {Number} the z-index to start at for proper overlapping */
  startingZIndex: function () {
    var totalCardsInCardGroups = this.get('totalCardsInCardGroups');
    var cardGroups = this.get('cardGroups');
    var thisCardGroup = this.get('cardGroup');
    var cardGroupIndex = 0;
    var cardGroup = cardGroups[cardGroupIndex];
    var startingZIndex = totalCardsInCardGroups;
    while (cardGroup !== thisCardGroup) {
      startingZIndex -= cardGroup.get('count');
      cardGroup = cardGroups[++cardGroupIndex];
    }
    return startingZIndex;
  }.property('totalCardsInCardGroups')
});
