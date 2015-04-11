import DS from 'ember-data';

export default DS.Model.extend({
  user: DS.belongsTo('user', {async: true}),
  isPlayer: DS.attr('boolean'),
  deckName: DS.attr('string'),
  deckId: DS.attr('string'),
  gameCards: DS.hasMany('gameCard', {embedded: true}),
  isReady: DS.attr('boolean', {defaultValue: false})
});
