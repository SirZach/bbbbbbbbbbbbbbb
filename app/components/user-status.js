import Ember from 'ember';
import layout from '../templates/components/user-status';

export default Ember.Component.extend({
  layout: layout,

  classNameBindings: ['statusClass'],

  statusClass: function () {
    var state = this.get('presence.state');
    return 'chat-' + state;
  }.property('presence.state'),

  isActive: Ember.computed.equal('presence.state', 'online'),

  isOffline: Ember.computed.equal('presence.state', 'offline'),

  lastSeenLabel: function () {
    var state = this.get('presence.state');
    if (state === 'idle') {
      return 'idle for';
    } else if (state === 'offline') {
      return 'last seen';
    }
  }.property('presence.state')
});
