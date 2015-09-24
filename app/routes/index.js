import Ember from 'ember';

export default Ember.Route.extend({
  redirect() {
    let destination = 'games.list';

    if (this.get('session.isAuthenticated')) {
      destination = 'decks.list';
    }

    this.replaceWith(destination);
  }
});
