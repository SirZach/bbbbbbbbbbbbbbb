import Ember from 'ember';

const { Component } = Ember;

export default Component.extend({
  types: ['Creature', 'Enchantment', 'Land', 'Instant', 'Sorcery', 'Artifact'],

  colors: ['Black', 'Blue', 'Green', 'Red', 'White'],

  legalities: ['Standard', 'Modern', 'Legacy', 'Vintage'],

  actions: {
    typesChanged() {
      this.sendAction('typesChanged');
    },
    colorsChanged() {
      this.sendAction('colorsChanged');
    },
    legalitiesChanged() {
      this.sendAction('legalitiesChanged');
    }
  }
});
