import Ember from 'ember';
import layout from '../templates/components/lil-card';

export default Ember.Component.extend({
  layout: layout,

  classNameBindings: [':lil-card', 'color'],

  /** @property {String} color class */
  color: function () {
    var colors = this.get('card.colors');
    if (!colors || !colors.length) {
      return 'lil-card-colorless';
    }
    if (colors.length === 1) {
      return `lil-card-${colors[0].toLowerCase()}`;
    }
    return `lil-card-multicolored`;
  }.property('card.colors')
});
