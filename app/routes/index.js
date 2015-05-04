import Ember from 'ember';

export default Ember.Route.extend({
  redirect: function () {
    var destination = 'games.list';

    if (this.get('session.isAuthenticated')) {
      destination = 'decks.list';
    }

    this.transitionTo(destination);
  }
});
