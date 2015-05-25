import Ember from 'ember';
import layout from '../templates/components/game-cards';

export default Ember.Component.extend({
  layout: layout,

  tagName: 'ul',

  classNames: 'game-cards'
});
