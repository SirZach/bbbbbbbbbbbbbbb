import Ember from 'ember';
import layout from '../templates/components/card-breakdown-chart';

export default Ember.Component.extend({
  layout: layout,

  bars: function () {
    var deck = this.get('deck');
    var cardGroups = deck.get('cardGroups');
    var mainCount = deck.get('mainCount');
    var stats = {
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
      .forEach((group) => {
        var mainType = group.get('card.mainType');
        if (!stats[mainType]) {
          stats[mainType] = {
            count: 0,
            width: 0
          };
        }
        var stat = stats[mainType];
        var count = group.get('count');
        stat.count += count;
        stat.width += (100 / mainCount) * count;
      });

    return Ember.keys(stats).map((cardType) => {
      return {
        label: cardType,
        count: stats[cardType].count,
        width: `${stats[cardType].width}%`
      };
    });
  }.property('deck')
});
