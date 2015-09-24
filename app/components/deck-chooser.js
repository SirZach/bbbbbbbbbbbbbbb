import Ember from 'ember';
import layout from '../templates/components/deck-chooser';

const { Component } = Ember;

export default Component.extend({
  layout,
  tagName: 'ul',
  classNames: ['deck-chooser'],
  actions: {
    onSelect(deck) {
      this.sendAction('action', deck);
    }
  }
});
