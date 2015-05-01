import Ember from 'ember';

export default Ember.Route.extend({
  redirect: function () {
    var destination = 'cards';

    if (this.get('session.isAuthenticated')) {
      destination = 'decks.list';
    }

    this.transitionTo(destination);
  }
});
