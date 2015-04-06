import Ember from 'ember';

export default Ember.Controller.extend({
  sortedPresences: function () {
    var presences = this.get('presences');
    if (!presences) {
      return null;
    }
    return Ember.ArrayProxy.createWithMixins(Ember.SortableMixin, {
      sortProperties: ['user.username', 'statePriority'],
      sortAscending: true,
      content: presences.get('content')
    });
  }.property('presences.@each.state', 'presences.@each.user')
});
