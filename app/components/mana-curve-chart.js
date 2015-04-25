import Ember from 'ember';
import layout from '../templates/components/mana-curve-chart';

var COLOR_ORDER = {
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
  costGroups: function () {
    // Make a structure that looks like this:
    // [{cmc: 1, cardGroups: [x, y, z]}, {cmc: 2, cardGroups: a, b, c}, ...]
    //
    var grouped = [];
    var mainCardGroups = this.get('deck.mainCardGroups');
    mainCardGroups.forEach((cardGroup) => {
      var cmc = cardGroup.get('card.cmc');
      if (cmc == null) {
        return;
      }
      var cmcBucket = grouped.findBy('cmc', cardGroup.get('card.cmc'));
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
      var cardGroups = costGroup.get('content');
      cardGroups.sort((a, b) => {
        var aColorWeight = COLOR_ORDER[a.get('card.displayColor')];
        var bColorWeight = COLOR_ORDER[b.get('card.displayColor')];
        if (aColorWeight !== bColorWeight) {
          return aColorWeight - bColorWeight;
        } else {
          return Ember.compare(a.get('card.name'), b.get('card.name'));
        }
      });
    });

    // Sort cost groups by converted mana cost.
    return grouped.sortBy('cmc');
  }.property('deck.mainCardGroups.[]')
});
