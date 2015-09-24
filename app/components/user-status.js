import Ember from 'ember';
import layout from '../templates/components/user-status';

export default Ember.Component.extend({
  layout: layout,

  classNameBindings: ['statusClass'],

  statusClass: function() {
    let state = this.get('presence.state');
    return 'user-' + state;
  }.property('presence.state'),

  isOnline: Ember.computed.equal('presence.state', 'online'),

  isOffline: Ember.computed.equal('presence.state', 'offline'),

  lastSeenLabel: function() {
    let state = this.get('presence.state');
    if (state === 'online') {
      return 'online';
    } else if (state === 'idle') {
      return 'idle for';
    } else if (state === 'offline') {
      return 'last seen';
    }
  }.property('presence.state')
});
