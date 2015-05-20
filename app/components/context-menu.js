import Ember from 'ember';
import layout from '../templates/components/context-menu';
import $ from 'jquery';

export default Ember.Component.extend({
  isOpen: false,

  layout: layout,

  tagName: 'context-menu',

  actions: {
    toggle: function () {
      this.toggleProperty('isOpen');
    }
  },

  clickHandler: function (event) {
    if (this.get('isOpen')) {
      if (!$(event.target).closest(`#${this.get('id')}`).length) {
        this.send('toggle');
      }
    }
  },

  attachCloseout: function () {
    $(document).on(`click.context-menu-${this.get('id')}`, this.clickHandler.bind(this));
  }.on('didInsertElement'),

  removeDocListener: function () {
    $(document).off(`click.context-menu-${this.get('id')}`);
  }.on('willDestroyElement')
});
