import Ember from 'ember';
import layout from '../templates/components/deck-chooser';

export default Ember.Component.extend({
  layout: layout,
  tagName: 'ul',
  classNames: ['deck-chooser'],
  actions: {
    onSelect: function (deck) {
      this.sendAction('action', deck);
    }
  }
});