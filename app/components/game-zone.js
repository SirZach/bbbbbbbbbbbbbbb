import Ember from 'ember';
import layout from '../templates/components/game-zone';
import $ from 'jquery';

export default Ember.Component.extend({
  layout: layout,

  tagName: 'game-zone',

  title: null,

  /** @property {Array<DS.Model GameCard>} */
  gameCards: [],

  /** @property {Array<DS.Model Card>} */
  cards: [],

  canOpen: true,

  isOpen: false,

  classNameBindings: 'canOpen:cursor-pointer',

  click: function () {
    if (this.get('canOpen')) {
      this.toggleProperty('isOpen');

      //in a run later because the isOpen hasn't expanded the DOM yet
      Ember.run.later(this, function () {
        if (this.get('isOpen')) {
          this.$('.game-cards').width($('game-board-container').width() - 100);
        }
      });
    }
  }
});
