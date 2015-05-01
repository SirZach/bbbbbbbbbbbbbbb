import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'tr',

  /**
   * Handles the mouse/focus enter event.
   */
  mouseEnter: function ($event) {
    this.sendAction('focusIn', $event, this.get('param'));
  },

  /**
   * Handles the mouse/focus leave event.
   */
  mouseLeave: function ($event) {
    this.sendAction('focusOut', $event, this.get('param'));
  },

  click: function () {
    this.sendAction('action', this.get('param'));
  }
});
