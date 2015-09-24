import DS from 'ember-data';

let PRIORITIES = {
  online: 1,
  idle: 2,
  offline: 3
};

export default DS.Model.extend({
  user: DS.belongsTo('user', {async: true}),
  state: DS.attr('string'),
  lastSeen: DS.attr('date'),

  statePriority: function() {
    let state = this.get('state');
    return PRIORITIES[state] || 99;
  }.property('state')
});
