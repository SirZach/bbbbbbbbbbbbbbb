import Ember from 'ember';
import layout from '../templates/components/sample-draw-chart';
import PaperCard from 'ember-paper/components/paper-card';
import shuffle from '../utils/shuffle';
import GameCard from '../models/game-card';

export default PaperCard.extend({
  layout,

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
      this.set(GameCard.HAND, cards.slice(0, 7));
      // The library is the 8th card to the end of the array.
      this.set(GameCard.LIBRARY, cards.slice(7));
    }
  }
});
