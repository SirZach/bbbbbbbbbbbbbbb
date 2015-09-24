import Ember from 'ember';

export default Ember.Route.extend({
  redirect: function() {
    let destination = 'games.list';

    if (this.get('session.isAuthenticated')) {
      destination = 'decks.list';
    }

    this.replaceWith(destination);
  }
});
