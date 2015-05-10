import Ember from 'ember';

export default Ember.Controller.extend({
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

  /** @property {Array} List of processed chat objects. */
  chats: function () {
    var model = this.get('model');
    var chats = [];
    model.forEach((rawChat) => {
      // If this is said by the same person as the last chat, append to the
      // previous chat object.
      //
      var lastChat = chats.get('lastObject');
      var properties = {
        when: rawChat.get('when'),
        name: rawChat.get('name'),
        avatarUrl: rawChat.get('avatarUrl'),
        isMe: rawChat.get('avatarUrl') === this.session.get('user.avatarUrl')
      };
      if (lastChat && lastChat.get('avatarUrl') === rawChat.get('avatarUrl')) {
        lastChat.get('messages').pushObject(rawChat.get('says'));
        lastChat.setProperties(properties);
      } else {
        properties.messages = [rawChat.get('says')];
        chats.pushObject(Ember.Object.create(properties));
      }
    });
    return chats;
  }.property('model.[]', 'session.user.avatarUrl')
});
