import Ember from 'ember';
import layout from '../templates/components/chat-pane';

const { Component } = Ember;

export default Component.extend({
  layout,

  classNames: 'chat-pane',

  didInitialScroll: false,

  _messageInserted() {
    Ember.run.schedule('afterRender', this, function() {
      if (this.get('didInitialScroll')) {
        this.$().animate({
          scrollTop: this.$().prop('scrollHeight')
        }, 500);
      } else {
        this.set('didInitialScroll', true);
        // Set a timeout to do this again to fix a problem with Chrome rendering.
        Ember.run.later(this, function() {
          this.$().scrollTop(this.$().prop('scrollHeight'));
        }, 400);
        this.$().scrollTop(this.$().prop('scrollHeight'));
      }
    });
  },

  actions: {
    messageInserted() {
      Ember.run.debounce(this, '_messageInserted', 150);
    }
  }
});
