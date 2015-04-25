import Ember from 'ember';
import layout from '../templates/components/lil-card-stack';

export default Ember.Component.extend({
  layout: layout,

  classNames: ['lil-card-stack'],

  /** @property {Array<Card>} a list of card copies (identical cards) */
  copies: function adsf () {
    var card = this.get('cardGroup.card');
    var count = this.get('cardGroup.count');
    var copies = [];
    for (var i = 0; i < count; i++) {
      copies.push(card);
    }
    return copies;
  }.property('cardGroup.card.name', 'cardGroup.count')
});
