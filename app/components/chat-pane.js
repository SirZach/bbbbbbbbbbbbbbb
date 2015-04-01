import Ember from 'ember';
import layout from '../templates/components/chat-pane';

export default Ember.Component.extend({
  layout: layout,

  _messageInserted: function () {
    Ember.run.schedule('afterRender', this, function () {
      this.$().animate({
        scrollTop: this.$().prop('scrollHeight')
      }, 500);
    });
  },

  actions: {
    messageInserted: function () {
      Ember.run.debounce(this, this._messageInserted, 150);
    }
  }
});
