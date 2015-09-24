import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'tr',

  /**
   * Handles the mouse/focus enter event.
   */
  mouseEnter($event) {
    this.sendAction('focusIn', $event, this.get('param'));
  },

  /**
   * Handles the mouse/focus leave event.
   */
  mouseLeave($event) {
    this.sendAction('focusOut', $event, this.get('param'));
  },

  click() {
    this.sendAction('action', this.get('param'));
  }
});
