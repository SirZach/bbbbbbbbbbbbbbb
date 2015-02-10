import Ember from 'ember';

export default Ember.Component.extend({
  types: ['Creature', 'Enchantment', 'Land', 'Instant', 'Sorcery', 'Artifact'],

  colors: ['Black', 'Blue', 'Green', 'Red', 'White'],

  legalities: ['Standard', 'Modern', 'Legacy', 'Vintage']
});
