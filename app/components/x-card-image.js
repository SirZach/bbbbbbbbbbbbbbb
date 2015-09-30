import Ember from 'ember';
import layout from '../templates/components/x-card-image';

export default Ember.Component.extend({
  layout,

  tagName: 'img',

  classNames: ['img-responsive'],

  attributeBindings: ['src']
});
