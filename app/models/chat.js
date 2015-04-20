import DS from 'ember-data';

export default DS.Model.extend({
  // user: DS.belongsTo('user'),
  channel: DS.attr('string'),
  when: DS.attr('number'),
  says: DS.attr('string'),
  // Until the user relationship is wired up.
  name: DS.attr('string'),
  avatarUrl: DS.attr('string')
});
