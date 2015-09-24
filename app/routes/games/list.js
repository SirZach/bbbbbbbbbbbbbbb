import Ember from 'ember';

export default Ember.Route.extend({
  model: function() {
    return this.store.filter('game', {orderBy: 'createdDate'}, () => true);
  },

  actions: {
    newGame: function() {
      // The user must not be anonymous.
      if (this.get('session.user.isAnonymous')) {
        return;
      }

      // Create a new game and transition to the playing field.
      var self = this;
      var user = this.get('session.user');
      var game = this.store.createRecord('game', {
        createdDate: new Date()
      });
      var gameParticipants = game.get('gameParticipants');
      var gameParticipant = this.store.createRecord('game-participant');
      gameParticipant.setProperties({
        user: user.get('content'),
        isPlaying: true,
        life: 20
      });
      gameParticipants.addObject(gameParticipant);

      game.save().then(function(game) {
        self.transitionTo('game', game);
      });
    }
  }
});
