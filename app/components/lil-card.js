import Ember from 'ember';
import layout from '../templates/components/lil-card';

export default Ember.Component.extend({
  layout,

  classNameBindings: [':lil-card', 'color'],

  attributeBindings: ['style'],

  /** @property {String} color class */
  color: function() {
    let color = this.get('cardInfo.card.displayColor');
    return `lil-card-${color}`;
  }.property('cardInfo.card.displayColor'),

  /** @property {String} z-index for proper stacking */
  style: function() {
    let zIndex = this.get('cardInfo.zIndex');
    return `z-index: ${zIndex};`;
  }.property('cardInfo.zIndex')
});
