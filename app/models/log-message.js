import DS from 'ember-data';

export default DS.Model.extend({
  createdDate: DS.attr('date'),
  message: DS.attr('string'),
  username: DS.attr('string'),
  userId: DS.attr('string'),
  level: DS.attr('string')
});
