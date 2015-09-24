import Ember from 'ember';
import layout from '../templates/components/failed-imports';

const { Component } = Ember;

export default Component.extend({
  layout,

  actions: {
    close() {
      this.sendAction();
    }
  }
});
