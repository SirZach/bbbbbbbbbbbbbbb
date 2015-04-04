import Ember from 'ember';
import layout from '../templates/components/chat-pane';

export default Ember.Component.extend({
  layout: layout,

  classNames: 'chat-pane',

  didInitialScroll: false,

  _messageInserted: function () {
    Ember.run.schedule('afterRender', this, function () {
      if (this.get('didInitialScroll')) {
        this.$().animate({
          scrollTop: this.$().prop('scrollHeight')
        }, 500);
      } else {
        this.set('didInitialScroll', true);
        this.$().scrollTop(this.$().prop('scrollHeight'));
      }
    });
  },

  actions: {
    messageInserted: function () {
      Ember.run.debounce(this, this._messageInserted, 150);
    }
  }
});
