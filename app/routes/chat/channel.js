import Ember from 'ember';

export default Ember.Route.extend({
  model: function (params) {
    var store = this.store;
    this.set('channel', params.channel);
    // ATTN PLEASE: HACK ATTACK.
    // Do a query against the server using the Firebase API. This returns an
    // immutable AdapterPopulatedRecordArray that does not auto update.
    // Bullshit.
    // Then make a live updating RecordArray that filters the store properly.
    //
    return store.find('chat', {
      orderBy: 'channel',
      equalTo: params.channel
    }).then(function () {
      return store.filter('chat', function (chat) {
        return chat.get('channel') === params.channel;
      });
    });
  },

  setupController: function (controller, model) {
    controller.set('channel', this.get('channel'));
    controller.set('presences');
    this.store.find('presence').then(function (presences) {
      controller.set('presences', presences);
    });
    return this._super(controller, model);
  },

  actions: {
    say: function (says) {
      if (says.trim().length === 0) {
        return;
      }
      this.controller.set('says');

      var name = this.get('session.currentUser.github.username');
      var avatarUrl =
        this.get('session.currentUser.github.cachedUserProfile.avatar_url');
      var when = new Date();
      var channel = this.get('channel');
      var chat = this.store.createRecord('chat', {
        name: name,
        avatarUrl: avatarUrl,
        says: says,
        when: when,
        channel: channel
      });
      chat.save();
    }
  }
});
