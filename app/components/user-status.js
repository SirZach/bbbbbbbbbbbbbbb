import Ember from 'ember';
import layout from '../templates/components/user-status';

export default Ember.Component.extend({
  layout: layout,

  classNameBindings: ['statusClass'],

  statusClass: function () {
    var state = this.get('presence.state');
    return 'chat-' + state;
  }.property('presence.state')
});
