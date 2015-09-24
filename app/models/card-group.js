import Ember from 'ember';
import DS from 'ember-data';

export default DS.Model.extend({
  /** @property {Card} - the card model with all the info about it */
  card: DS.belongsTo('card', {async: true}),

  /** @property {String} - 'main', 'side' (, 'maybe?') */
  board: DS.attr('string'),

  /** @property {Number} - how many of this card */
  count: DS.attr('number'),

  /** @property {String} - combo of board and card type */
  superType: function() {
    let board = this.get('board');
    let type = this.get('card.type');
    return board + type;
  }.property('board', 'card.type'),

  cmc: Ember.computed.alias('card.cmc')
});
