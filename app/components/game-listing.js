import Ember from 'ember';
import layout from '../templates/components/game-listing';

export default Ember.Component.extend({
  layout: layout,

  playerInfos: function () {
    var gameParticipants = this.get('game.gameParticipants');
    if (!gameParticipants) {
      return [];
    }
    var playerInfos = gameParticipants.filterBy('isPlayer').map(function (player) {
      return {
        username: player.get('user.username'),
        avatarUrl: player.get('user.avatarUrl'),
        deckName: player.get('deckName'),
        deckId: player.get('deckId')
      };
    });
    while (playerInfos.length < 2) {
      playerInfos.pushObject({
        avatarUrl: 'http://www.gravatar.com/avatar/?s=256&default=mm',
        username: '???'
      });
    }
    return playerInfos;
  }.property(
    'game.gameParticipants.@each.user.username',
    'game.gameParticipants.@each.deckName'),

  playerOne: function () {
    return this.get('playerInfos').objectAt(0);
  }.property('playerInfos.@each'),

  playerTwo: function () {
    return this.get('playerInfos').objectAt(1);
  }.property('playerInfos.@each')
});
