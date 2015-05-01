import DS from 'ember-data';

export default DS.Model.extend({
  /** @property {Date} When this game was created. */
  createdDate: DS.attr('date'),

  /** @property {Array<GameParticipant>} Embedded participant records. */
  gameParticipants: DS.hasMany('gameParticipant', {embedded: true}),

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
  }.property('gameParticipants.@each.isPlaying')
});
