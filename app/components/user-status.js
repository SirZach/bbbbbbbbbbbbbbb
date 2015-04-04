import Ember from 'ember';
import layout from '../templates/components/user-status';

export default Ember.Component.extend({
  layout: layout,

  classNameBindings: ['statusClass'],

  statusClass: function () {
    var status = this.get('presence.state');
    if (status === 'online') {
      return 'chat-online';
    } else if (status === 'offline') {
      return 'chat-offline';
    }
  }.property('presence.state')
});
