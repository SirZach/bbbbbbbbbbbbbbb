import Ember from 'ember';
import layout from '../templates/components/game-listing';

export default Ember.Component.extend({
  layout: layout,

  players: function () {
    var gameParticipants = this.get('game.gameParticipants');
    var players = gameParticipants.filterBy('isPlaying');
    while (players.length < 2) {
      players.pushObject({
        user: {
          avatarUrl: 'http://www.gravatar.com/avatar/?s=256&default=mm',
          username: '???'
        }
      });
    }
    return players;
  }.property(
    'game.gameParticipants.@each.user.username',
    'game.gameParticipants.@each.deckName'),

  playerOne: function () {
    return this.get('players').objectAt(0);
  }.property('players.@each'),

  playerTwo: function () {
    return this.get('players').objectAt(1);
  }.property('players.@each'),

  watchers: function () {
    var gameParticipants = this.get('game.gameParticipants');
    return gameParticipants.rejectBy('isPlaying');
  }.property('game.gameParticipants.@each.isPlaying')
});
