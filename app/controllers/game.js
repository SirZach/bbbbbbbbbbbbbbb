import Ember from 'ember';

export default Ember.Controller.extend({
  /** @property {Boolean} Is the game going? */
  isGameInProgress: function () {
    var players = this.get('players');
    return players.get('length') === 2 && players.every((player) => player && player.get('isReady'));
  }.property('players.@each.isReady'),

  isGameInPrep: Ember.computed.not('isGameInProgress'),

  /** @property {Boolean} Is the game over? */
  isGameOver: Ember.computed.equal('model.status', 'ended'),

  /** @property {Boolean} Am I one of the players? */
  amIPlaying: function () {
    var playerUserIds = this.get('model.gameParticipants')
      .filterBy('isPlaying')
      .mapBy('user.id')
      .compact();
    var myId = this.get('session.user.id');
    return playerUserIds.contains(myId);
  }.property(
    'model.gameParticipants.@each.{isPlaying,userId}',
    'session.user.id'),

  /** @property {GameParticipant} The participant representing me. */
  participant: function () {
    var participants = this.get('model.gameParticipants');
    var myId = this.get('session.user.id');
    return participants.findBy('user.id', myId);
  }.property('model.gameParticipants.@each.userId', 'session.user.id'),

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
  }.property('playerOne.user.avatarUrl'),

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
  }.property('playerTwo.user.avatarUrl'),

  /** @property {Boolean} Is there at least one open seat? */
  isWaitingForOpponent: function () {
    var players = this.get('model.gameParticipants').filterBy('isPlaying');
    return players.length < 2;
  }.property('model.gameParticipants.@each.isPlaying'),

  /** @property {String} The title showing on the top half of the board. */
  topBoardTitle: function () {
    var isGameInPrep = this.get('isGameInPrep');
    var playerTwoUsername = this.get('playerTwo.user.username');
    var playerTwoIsReady = this.get('playerTwo.isReady');

    if (playerTwoUsername) {
      if (isGameInPrep) {
        if (playerTwoIsReady) {
          return `${playerTwoUsername} is ready`;
        } else {
          return `Waiting for ${playerTwoUsername} to choose a deck`;
        }
      } else {
        return playerTwoUsername;
      }
    } else {
      return 'Waiting for player...';
    }
  }.property(
    'isGameInPrep',
    'playerTwo.user.{username,isReady}'),

  /** @property {String} The title showing on the bottom half of the board. */
  bottomBoardTitle: function () {
    var isGameInPrep = this.get('isGameInPrep');
    var amIPlaying = this.get('amIPlaying');
    var playerOneUsername = this.get('playerOne.user.username');
    var playerOneIsReady = this.get('playerOne.isReady');

    if (amIPlaying) {
      if (isGameInPrep && !playerOneIsReady) {
        return 'Choose a deck';
      } else {
        return 'You are ready';
      }
    } else {
      if (playerOneUsername) {
        if (isGameInPrep) {
          if (playerOneIsReady) {
            return `${playerOneUsername} is ready`;
          } else {
            return `Waiting for ${playerOneUsername} to choose a deck`;
          }
        } else {
          return playerOneUsername;
        }
      } else {
        return 'Waiting for player...';
      }
    }
  }.property(
    'isGameInPrep',
    'playerOne.user.{username,isReady}',
    'amIPlaying'),

  /** @property {Boolean} Is there no player one playing yet? */
  noPlayerOnePresent: Ember.computed.not('playerOne'),

  /** @property {Boolean} Is the bottom seat open and am I eligible to join? */
  canIJoinAsPlayer: Ember.computed.and(
    'noPlayerOnePresent',
    'session.user.hasGameReadyDecks'),

  /** @property {Boolean} show or hide the chat channel */
  showChat: true,

  /** @property {Boolean} has participant chosen a deck? */
  hasChosenDeck: Ember.computed.and('participant.deckName', 'participant.deckId'),

  /** @property {Boolean} participant can mark themselves ready */
  participantCanReady: function () {
    var amIPlaying = this.get('amIPlaying');
    if (!amIPlaying) {
      return false;
    }

    return this.get('hasChosenDeck') && !this.get('participant.isReady');
  }.property('amIPlaying', 'participant.isReady', 'hasChosenDeck'),

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
    },

    /**
     * Set the participant in the ready state
     */
    iAmReady: function () {
      var participant = this.get('participant');
      participant.set('isReady', true);
      this.get('model').save();
    },

    toggleChat: function () {
      this.toggleProperty('showChat');
    }
  }
});
