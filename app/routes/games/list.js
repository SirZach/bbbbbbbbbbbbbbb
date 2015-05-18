import Ember from 'ember';

export default Ember.Route.extend({
  renderTemplate: function () {
    this._super.apply(this, arguments);

    this.render('nav-toolbars/games-list', {
      into: 'application',
      outlet: 'nav-toolbar'
    });
  },

  actions: {
    newGame: function () {
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
      var gameParticipant = this.store.createRecord('gameParticipant');
      gameParticipant.setProperties({
        user: user.get('content'),
        isPlaying: true,
        life: 20
      });
      gameParticipants.addObject(gameParticipant);

      game.save().then(function (game) {
        self.transitionTo('game', game);
      });
    }
  }
});
