import Ember from 'ember';

export default Ember.Route.extend({
  beforeModel: function () {
    if (!this.get('session.isAuthenticated')) {
      this.replaceWith('/');
    }

    // Create a new game and transition to the playing field.
    var self = this;
    var user = this.get('session.user');
    var game = this.store.createRecord('game', {
      createdDate: new Date()
    });
    return game.save()
      .then(function (game) {
        game.get('players').addObject(user);
        return game.save();
      })
      .then(function (game) {
        self.transitionTo('game', game);
      });
  }
});
