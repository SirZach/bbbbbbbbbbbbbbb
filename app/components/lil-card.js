import Ember from 'ember';
import layout from '../templates/components/lil-card';

export default Ember.Component.extend({
  layout: layout,

  classNameBindings: [':lil-card', 'color'],

  attributeBindings: ['style'],

  /** @property {String} color class */
  color: function () {
    var colors = this.get('cardInfo.card.colors');
    if (!colors || !colors.length) {
      return 'lil-card-colorless';
    }
    if (colors.length === 1) {
      return `lil-card-${colors[0].toLowerCase()}`;
    }
    return `lil-card-multicolored`;
  }.property('cardInfo.card.colors'),

  /** @property {String} z-index for proper stacking */
  style: function () {
    var zIndex = this.get('cardInfo.zIndex');
    return `z-index: ${zIndex};`;
  }.property('cardInfo.zIndex')
});
