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

  /** @property {DS.GameParticipant} */
  player: null,

  /** @property {Boolean} a card is being dragged on the screen */
  cardIsDragging: false,

  /** @property {Boolean} this game-zone is currently the drop target */
  isDraggedOver: false,

  classNameBindings: ['canOpen:cursor-pointer', 'cardIsDragging:show-drop', 'isDraggedOver'],

  drop: function (event) {
    event.preventDefault();
    var dragData = JSON.parse(event.dataTransfer.getData('text/plain'));

    this.sendAction('droppedOn', dragData, this.get('player'), this.get('title').toLowerCase());
  },

  dragOver: function (event) {
    event.preventDefault();
    this.set('isDraggedOver', true);
  },

  dragEnter: function (event) {
    event.preventDefault();
    this.set('isDraggedOver', true);
  },

  dragLeave: function (event) {
    event.preventDefault();
    this.set('isDraggedOver', false);
  },

  click: function () {
    if (this.get('canOpen')) {
      this.sendAction('open', this.get('player'), this.get('gameCards'), this.get('title'));
    }
  }
});
