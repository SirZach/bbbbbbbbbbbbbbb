import Ember from 'ember';
import layout from '../templates/components/game-zone';

export default Ember.Component.extend({
  layout: layout,

  tagName: 'game-zone',

  title: null
});
