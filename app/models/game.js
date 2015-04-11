import DS from 'ember-data';

export default DS.Model.extend({
  /** @property {Date} When this game was created. */
  createdDate: DS.attr('date'),

  /** @property {Array<GameParticipant>} Embedded participant records. */
  gameParticipants: DS.hasMany('gameParticipant', {embedded: true}),

  /** @property {String} One of 'preparing', 'in-play', 'ended'. */
  status: DS.attr('string', {defaultValue: 'preparing'})
});
