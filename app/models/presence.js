import DS from 'ember-data';

var PRIORITIES = {
  online: 1,
  idle: 2,
  offline: 3
};

export default DS.Model.extend({
  user: DS.belongsTo('user', {async: true}),
  state: DS.attr('string'),

  statePriority: function () {
    var state = this.get('state');
    return PRIORITIES[state] || 99;
  }.property('state')
});
