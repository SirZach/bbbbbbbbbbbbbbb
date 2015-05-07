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
      }
    };

    cardGroups
      .filterBy('board', 'main')
      .forEach((group) => {
        var stat = stats[group.get('card.mainType')]
        var count = group.get('count');
        stat.count += count;
        stat.width += (100 / mainCount) * count;
      });

    return [
      {label: 'Creature', count: stats.Creature.count, width: `${stats.Creature.width}%`},
      {label: 'Artifact', count: stats.Artifact.count, width: `${stats.Artifact.width}%`},
      {label: 'Sorcery', count: stats.Sorcery.count, width: `${stats.Sorcery.width}%`},
      {label: 'Instant', count: stats.Instant.count, width: `${stats.Instant.width}%`},
      {label: 'Land', count: stats.Land.count, width: `${stats.Land.width}%`}
    ];
  }.property('deck')
});
