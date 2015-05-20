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

  createClickHandler: function () {
    var contextMenu = this;
    function clickHandler(event) {
      if (contextMenu.get('isOpen')) {
        if (!$(event.target).closest(`#${contextMenu.get('elementId')}`).length) {
          contextMenu.send('toggle');
        }
      }
    }
    return clickHandler;
  },

  attachCloseout: function () {
    $(document).on(`click.context-menu-${this.get('elementId')}`, this.createClickHandler());
  }.on('didInsertElement'),

  removeDocListener: function () {
    $(document).off(`click.context-menu-${this.get('elementId')}`);
  }.on('willDestroyElement')
});
