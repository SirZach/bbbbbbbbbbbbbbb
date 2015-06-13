import Ember from 'ember';
import layout from '../templates/components/game-zone';
import $ from 'jquery';

export default Ember.Component.extend({
  layout: layout,

  tagName: 'game-zone',

  title: null,

  /** @property {Array<DS.Model GameCard>} */
  gameCards: [],

  canOpen: true,

  classNameBindings: ['canOpen:cursor-pointer', 'cardIsDragging:show-drop'],

  drop: function (event) {
    event.preventDefault();
    debugger;
  },

  dragOver: function (event) {
    event.preventDefault();
  },

  dragEnter: function (event) {
    event.preventDefault();
  },

  click: function () {
    if (this.get('canOpen')) {
      this.sendAction('open', this.get('player'), this.get('gameCards'), this.get('title'));
    }
  }
});
