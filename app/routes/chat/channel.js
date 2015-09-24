import Ember from 'ember';

export default Ember.Route.extend({
  model: function(params) {
    var store = this.store;
    this.set('channel', params.channel);
    // ATTN PLEASE: HACK ATTACK.
    // Do a query against the server using the Firebase API. This returns an
    // immutable AdapterPopulatedRecordArray that does not auto update.
    // Bullshit.
    // Then make a live updating RecordArray that filters the store properly.
    //
    return store.query('chat', {
      orderBy: 'channel',
      equalTo: params.channel
    }).then(function() {
      return store.filter('chat', function(chat) {
        return chat.get('channel') === params.channel;
      });
    });
  },

  setupController: function(controller, model) {
    controller.set('channel', this.get('channel'));
    controller.set('presences');
    var presences = this.store.filter('presence', {}, presence => !!presence.get('user'));
    controller.set('presences', presences);
    return this._super(controller, model);
  }
});
