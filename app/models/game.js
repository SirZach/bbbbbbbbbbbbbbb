import DS from 'ember-data';
import Ember from 'ember';

export default DS.Model.extend({
  /** @property {Date} When this game was created. */
  createdDate: DS.attr('date'),

  /** @property {Array<GameParticipant>} Embedded participant records. */
  gameParticipants: DS.hasMany('gameParticipant'),

  /** @property {String} One of 'preparing', 'in-play', 'ended'. */
  status: DS.attr('string'),

  /** @property {Array<GameParticipant>} People playing the game. */
  players: function () {
    var gameParticipants = this.get('gameParticipants');
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
    'gameParticipants.@each.user',
    'gameParticipants.@each.deckName',
    'gameParticipants.@each.isPlaying'),

  /** @property {GameParticipant} The first player. */
  playerOne: function () {
    return this.get('players').objectAt(0);
  }.property('players.@each'),

  /** @property {GameParticipant} The second player. */
  playerTwo: function () {
    return this.get('players').objectAt(1);
  }.property('players.@each'),

  /** @property {Array<GameParticipant>} People watching the game. */
  watchers: function () {
    var gameParticipants = this.get('gameParticipants');
    return gameParticipants
      .rejectBy('isPlaying')
      .filterBy('isPresent');
  }.property('gameParticipants.@each.isPlaying'),

  /** @property {Boolean} Is the game over? */
  isGameOver: Ember.computed.equal('status', 'ended'),

  /** @property {Boolean} Is there at least one open seat? */
  isWaitingForOpponent: function () {
    var players = this.get('gameParticipants').filterBy('isPlaying');
    return players.length < 2;
  }.property('gameParticipants.@each.isPlaying'),

  save: function () {
    var participants = this.get('gameParticipants');
    participants.invoke('setGameCardsRaw');
    return this._super.apply(this, arguments);
  }
});
