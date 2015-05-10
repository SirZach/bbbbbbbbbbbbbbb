import Ember from 'ember';
import layout from '../templates/components/game-listing';

export default Ember.Component.extend({
  layout: layout,

  canDeleteGame: function () {
    var playerOne = this.get('game.playerOne');
    var currentUser = this.get('currentUser');
    var players = this.get('game.gameParticipants').filterBy('isPlaying');

    return players.get('length') < 2 && playerOne.get('user.id') === currentUser;
  }.property('game.playerOne.user.id', 'currentUser', 'game.gameParticipants.[].isPlaying'),

  actions: {
    deleteGame: function (game) {
      this.sendAction('deleteGame', game);
    }
  }
});
