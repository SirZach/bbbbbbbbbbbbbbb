import Ember from 'ember';

export default Ember.Controller.extend({
  /** @property {Boolean} Is the game going? */
  isGameInProgress: Ember.computed.equal('model.status', 'in-play'),

  /** @property {Boolean} The game hasn't started yet? */
  isGameInPrep: Ember.computed.equal('model.status', 'preparing'),

  /** @property {Boolean} Is the game over? */
  isGameOver: Ember.computed.equal('model.status', 'ended'),

  /** @property {Boolean} Am I one of the players? */
  amIPlaying: function () {
    var playerUserIds = this.get('model.players').mapBy('user.id');
    var myId = this.get('session.user.id');
    return playerUserIds.contains(myId);
  }.property('model.players.@each.user', 'session.user.id'),

  /** @property {GameParticipant} The participant representing me. */
  participant: function () {
    var participants = this.get('model.gameParticipants');
    var myId = this.get('session.user.id');
    return participants.findBy('user.id', myId);
  }.property('model.gameParticipants.@each.user', 'session.user.id'),

  /**
   * @property {Array<GameParticipant>} The participants playing the game. The
   *                                    first player will be me if I am playing.
   *                                    It will be null if I am not playing and
   *                                    there is only one other player.
   */
  players: function () {
    var players = this.get('model.gameParticipants').filterBy('isPlaying');
    var amIPlaying = this.get('amIPlaying');
    var myId = this.get('session.user.id');
    if (!amIPlaying) {
      if (players.length > 1) {
        // Simply sort by username.
        return players.sortBy('user.username');
      } else {
        // Make the first player null and the other player the second player.
        return [null].concat(players);
      }
    } else {
      // Make sure I am the first player.
      return [this.get('participant')]
        .concat(players.rejectBy('user.id', myId));
    }
  }.property('model.gameParticipants.@each.isPlaying', 'amIPlaying'),

  playerOne: function () {
    return this.get('players')[0];
  }.property('players.@each'),

  playerOneAvatarUrl: function () {
    var playerOne = this.get('playerOne');
    if (playerOne) {
      return playerOne.get('user.avatarUrl');
    } else {
      return 'http://www.gravatar.com/avatar/?s=256&default=mm';
    }
  }.property('playerOne'),

  playerTwo: function () {
    return this.get('players')[1];
  }.property('players.@each'),

  playerTwoAvatarUrl: function () {
    var playerTwo = this.get('playerTwo');
    if (playerTwo) {
      return playerTwo.get('user.avatarUrl');
    } else {
      return 'http://www.gravatar.com/avatar/?s=256&default=mm';
    }
  }.property('playerTwo'),

  /** @property {Boolean} Is there at least one open seat? */
  isWaitingForOpponent: function () {
    var players = this.get('model.gameParticipants').filterBy('isPlaying');
    return players.length < 2;
  }.property('model.gameParticipants.@each.isPlaying'),

  /** @property {String} The title showing on the top half of the board. */
  topBoardTitle: function () {
    var isWaitingForOpponent = this.get('isWaitingForOpponent');
    var isGameInPrep = this.get('isGameInPrep');
    var isGameOver = this.get('isGameOver');
    var isGameInProgress = this.get('isGameInProgress');
    var username = this.get('playerTwo.username.name');

    if (isGameInPrep && isWaitingForOpponent) {
      return 'Waiting for player...';
    } else if (isGameInPrep && !isWaitingForOpponent) {
      return `Waiting for ${username} to choose a deck.`;
    }
  }.property(
    'isWaitingForOpponent',
    'isGameInPrep',
    'isGameOver',
    'isGameInProgress'),

  /** @property {String} The title showing on the bottom half of the board. */
  bottomBoardTitle: function () {
    var isWaitingForOpponent = this.get('isWaitingForOpponent');
    var isGameInPrep = this.get('isGameInPrep');
    var isGameOver = this.get('isGameOver');
    var isGameInProgress = this.get('isGameInProgress');
    var amIPlaying = this.get('amIPlaying');
    var username = this.get('playerOne.user.username');

    if (isGameInPrep && amIPlaying) {
      return 'Choose a deck';
    } else if (isGameInPrep && !amIPlaying) {
      return `Waiting for ${username} to choose a deck.`;
    }
  }.property(
    'isWaitingForOpponent',
    'isGameInPrep',
    'isGameOver',
    'isGameInProgress',
    'amIPlaying'),

  actions: {
    /**
     * Respond to a deck selection event.
     *
     * @param {Deck} deck   The selected deck model.
     */
    selectDeck: function (deck) {
      var participant = this.get('participant');
      participant.set('deckName', deck.get('name'));
      participant.set('deckId', deck.get('id'));
      this.get('model').save();
    }
  }
});
