import Ember from 'ember';

let PresencesContainer = Ember.ArrayProxy.extend(Ember.SortableMixin);

export default Ember.Controller.extend({
  /** @property {String} bound to the chat input */
  says: null,

  /** @property {String} set by the route */
  channel: null,

  sortedPresences: function() {
    let presences = this.get('presences');
    if (!presences) {
      return null;
    }
    return PresencesContainer.create({
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
