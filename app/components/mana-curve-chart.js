import Ember from 'ember';
import layout from '../templates/components/mana-curve-chart';

let COLOR_ORDER = {
  colorless: 1,
  white: 2,
  blue: 3,
  black: 4,
  red: 5,
  green: 6,
  multicolored: 7
};

export default Ember.Component.extend({
  layout: layout,

  classNames: ['mana-curve-chart'],

  /** @property {Array} CardGroups organized by cost. */
  costGroups: function() {
    // Make a structure that looks like this:
    // [{cmc: 1, cardGroups: [x, y, z]}, {cmc: 2, cardGroups: a, b, c}, ...]
    //
    let grouped = [];
    let mainCardGroups = this.get('deck.mainCardGroups');
    mainCardGroups.forEach((cardGroup) => {
      let cmc = cardGroup.get('card.cmc');
      if (cmc == null) {
        return;
      }
      let cmcBucket = grouped.findBy('cmc', cardGroup.get('card.cmc'));
      if (!cmcBucket) {
        grouped.pushObject(Ember.Object.create({
          cmc: cmc,
          content: []
        }));
      }
      cmcBucket = grouped.findBy('cmc', cardGroup.get('card.cmc'));
      cmcBucket.get('content').pushObject(cardGroup);
    });
    // Sort each stack by color and name.
    grouped.forEach((costGroup) => {
      let cardGroups = costGroup.get('content');
      cardGroups.sort((a, b) => {
        let aColorWeight = COLOR_ORDER[a.get('card.displayColor')];
        let bColorWeight = COLOR_ORDER[b.get('card.displayColor')];
        if (aColorWeight !== bColorWeight) {
          return aColorWeight - bColorWeight;
        } else {
          return Ember.compare(a.get('card.name'), b.get('card.name'));
        }
      });
    });

    // Sort cost groups by converted mana cost.
    return grouped.sortBy('cmc');
  }.property('deck.mainCardGroups.[]'),

  /** @property {Boolean} flag to hide or show the card spoiler */
  cardSpoilerHidden: 'hidden',

  /** @property {Boolean} Render spoiler on right side? */
  isSpoilerOpposite: function() {
    return this.get('spoilerPosition') === 'right';
  }.property('spoilerPosition'),

  actions: {
    /**
     * Show this card image.
     */
    cardFocusIn: function(card) {
      this.set('spoilerCard', card);
      this.set('cardSpoilerHidden', false);
    },

    /**
     * Hide this card image.
     */
    cardFocusOut: function(card) {
      this.set('cardSpoilerHidden', true);
    }
  }
});
