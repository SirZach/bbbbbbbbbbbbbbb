import Ember from 'ember';

export default Ember.Controller.extend({
  canParticipate: Ember.computed.readOnly('session.isAuthenticated'),

  cannotParticipate: Ember.computed.not('canParticipate'),

  sortedPresences: function () {
    var presences = this.get('presences');
    if (!presences) {
      return null;
    }
    return Ember.ArrayProxy.createWithMixins(Ember.SortableMixin, {
      sortProperties: ['statePriority', 'user.username'],
      sortAscending: true,
      content: presences.get('content')
    });
  }.property('presences.@each.state', 'presences.@each.user.username')
});
