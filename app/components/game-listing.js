import Ember from 'ember';
import layout from '../templates/components/game-listing';

export default Ember.Component.extend({
  layout: layout,

  matchup: function () {
    var gameParticipants = this.get('game.gameParticipants') || [];
    var players = gameParticipants.filterBy('isPlayer');
    if (!players) {
      return '? vs. ?';
    }
    var names = players.mapBy('user.username');
    if (names.length < 2) {
      names.push('?');
    }
    return names.join(' vs. ');
  }.property(
    'game.gameParticipants.@each.user.username',
    'game.gameParticipants.@each.deckName')
});
