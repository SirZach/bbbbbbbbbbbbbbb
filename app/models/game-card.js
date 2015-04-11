import DS from 'ember-data';

export default DS.Model.extend({
  /** @property {Card} Reference to the card definition. */
  card: DS.belongsTo('card'),

  /** @property {Boolean} Is the card tapped? */
  isTapped: DS.attr('boolean'),

  /** @property {Number} Relative x position on the battlefield. */
  x: DS.attr('number'),

  /** @property {Number} Relative y position on the battlefield. */
  y: DS.attr('number'),

  /** @property {String} 'hand', 'library', 'graveyard', 'exile', 'battlefield' */
  zone: DS.attr('string')
});
