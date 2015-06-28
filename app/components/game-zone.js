import Ember from 'ember';
import layout from '../templates/components/game-zone';
import $ from 'jquery';

export default Ember.Component.extend({
  layout: layout,

  tagName: 'game-zone',

  title: null,

  /** @property {Array<DS.Model GameCard>} */
  gameCards: [],

  /** @property {Boolean} can populate the left column */
  canOpen: true,

  /** @property {DS.GameParticipant} */
  player: null,

  /** @property {Boolean} a card is being dragged on the screen */
  cardIsDragging: false,

  /** @property {Boolean} this game-zone is currently the drop target */
  isDraggedOver: false,

  /** @property {Boolean} if you're not player one, no interactions allowed */
  readOnly: null,

  classNameBindings: ['canOpen', 'cardIsDragging:show-drop', 'isDraggedOver', 'readOnly'],

  drop: function (event) {
    event.preventDefault();
    var dragData = JSON.parse(event.dataTransfer.getData('text/plain'));

    this.sendAction('droppedOn', dragData, this.get('player'), this.get('title').toLowerCase());

    this.set('isDraggedOver', false);
    //For some reason when this guy handles the drop, the dragEnd event is not fired. Le sigh.
    this.sendAction('dragEnded');
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
    if (this.get('canOpen') && !this.get('readOnly')) {
      this.sendAction('open', this.get('player'), this.get('gameCards'), this.get('title'));
    }
  }
});
