import Ember from 'ember';
import layout from '../templates/components/mana-curve-chart';

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
    return grouped.sortBy('cmc')
  }.property('deck.mainCardGroups.[]')
});
