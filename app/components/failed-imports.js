import Ember from 'ember';
import layout from '../templates/components/failed-imports';

export default Ember.Component.extend({
  layout: layout,

  actions: {
    close: function () {
      this.sendAction();
    }
  }
});
