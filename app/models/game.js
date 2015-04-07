import DS from 'ember-data';

export default DS.Model.extend({
  createdDate: DS.attr('date'),
  watchers: DS.hasMany('user'),
  players: DS.hasMany('user')
  // state: DS.attr()
});
