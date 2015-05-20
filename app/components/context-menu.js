import Ember from 'ember';
import layout from '../templates/components/context-menu';

export default Ember.Component.extend({
  isOpen: false,

  layout: layout,

  tagName: 'context-menu',

  actions: {
    toggle: function () {
      this.toggleProperty('isOpen');
    }
  }
});
