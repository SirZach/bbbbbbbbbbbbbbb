import Ember from 'ember';
import layout from '../templates/components/card-breakdown-chart';
const { computed, Component, Handlebars } = Ember;

const StatObj = Ember.Object.extend({
  widthStyle: computed('width', function() {
    let width = this.get('width');

    return new Handlebars.SafeString(`width: ${width}`);
  })
});

export default Component.extend({
  layout,

  bars: computed('deck', function() {
    let deck = this.get('deck');
    let cardGroups = deck.get('cardGroups');
    let mainCount = deck.get('mainCount');
    let stats = {
      Creature: {
        count: 0,
        width: 0
      },
      Artifact: {
        count: 0,
        width: 0
      },
      Sorcery: {
        count: 0,
        width: 0
      },
      Instant: {
        count: 0,
        width: 0
      },
      Land: {
        count: 0,
        width: 0
      },
      Enchantment: {
        count: 0,
        width: 0
      }
    };

    cardGroups
      .filterBy('board', 'main')
      .forEach(group => {
        let mainType = group.get('card.mainType');
        if (!stats[mainType]) {
          stats[mainType] = {
            count: 0,
            width: 0
          };
        }
        let stat = stats[mainType];
        let count = group.get('count');
        stat.count += count;
        stat.width += (100 / mainCount) * count;
      });

    return Object.keys(stats).map((cardType) => {
      return StatObj.create({
        label: cardType,
        count: stats[cardType].count,
        width: `${stats[cardType].width}%`
      });
    });
  })
});
