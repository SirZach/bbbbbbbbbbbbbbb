import Ember from 'ember';
import layout from '../templates/components/sample-draw-chart';
import PaperCard from 'ember-paper/components/paper-card';
import shuffle from '../utils/shuffle';

export default PaperCard.extend({
  layout,

  fullscreen: false,

  willInsertElement: function () {
    this.send('refresh');
  },

  /** @property {Array<Card>} The hand sorted by cmc and name. */
  sortedHand: function () {
    var hand = this.get('hand') || [];
    return hand.sortBy('cmc', 'name');
  }.property('hand'),

  actions: {
    /**
     * "Draw" a new hand by choosing 7 random cards from the deck.
     */
    refresh: function () {
      var cardGroups = this.get('deck.mainCardGroups') || [];
      var cards = [];
      cardGroups.forEach((cardGroup) => {
        for (var i = 0; i < cardGroup.get('count'); i++) {
          cards.push(cardGroup.get('card'));
        }
      });
      cards = shuffle(cards);
      // The hand is the first 7 cards.
      this.set('hand', cards.slice(0, 7));
      // The library is the 8th card to the end of the array.
      this.set('library', cards.slice(7));
    },

    fullscreen: function () {
      this.toggleProperty('fullscreen');
    }
  }
});
