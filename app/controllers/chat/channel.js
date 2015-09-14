import Ember from 'ember';

export default Ember.Controller.extend({
  /** @property {String} bound to the chat input */
  says: null,

  /** @property {String} set by the route */
  channel: null,

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
  }.property('presences.@each.state', 'presences.@each.user.username'),

  actions: {
    submitChat() {
      let says = this.get('says');
      let channel = this.get('channel');
      this.send('say', says, channel);
      this.set('says', null);
    }
  }
});
