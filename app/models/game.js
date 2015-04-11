import DS from 'ember-data';

export default DS.Model.extend({
  createdDate: DS.attr('date'),
  gameParticipants: DS.hasMany('gameParticipant', {embedded: true}),
  isStarted: DS.attr('boolean', {defaultValue: false})
});
