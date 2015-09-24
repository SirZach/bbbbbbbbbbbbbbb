import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    return this.store.filter('game', { orderBy: 'createdDate' }, () => true);
  },

  actions: {
    newGame() {
      // The user must not be anonymous.
      if (this.get('session.user.isAnonymous')) {
        return;
      }

      // Create a new game and transition to the playing field.
      let self = this;
      let user = this.get('session.user');
      let game = this.store.createRecord('game', {
        createdDate: new Date()
      });
      let gameParticipants = game.get('gameParticipants');
      let gameParticipant = this.store.createRecord('game-participant');
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
