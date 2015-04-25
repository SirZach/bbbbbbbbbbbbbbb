import Ember from 'ember';
import layout from '../templates/components/lil-card';

export default Ember.Component.extend({
  layout: layout,

  classNameBindings: [':lil-card', 'color'],

  attributeBindings: ['style', 'title'],

  /** @property {String} color class */
  color: function () {
    var color = this.get('cardInfo.card.displayColor');
    return `lil-card-${color}`;
  }.property('cardInfo.card.displayColor'),

  /** @property {String} z-index for proper stacking */
  style: function () {
    var zIndex = this.get('cardInfo.zIndex');
    return `z-index: ${zIndex};`;
  }.property('cardInfo.zIndex'),

  title: Ember.computed.oneWay('cardInfo.card.name')
});
