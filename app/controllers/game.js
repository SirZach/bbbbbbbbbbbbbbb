import Ember from 'ember';
import shuffle from '../utils/shuffle';

export default Ember.Controller.extend({
  /** @property {Boolean} Is the game going? */
  isGameInProgress: function () {
    var players = this.get('players');
    return players.get('length') === 2 && players.every((player) => player && player.get('isReady'));
  }.property('players.@each.isReady'),

  isGameInPrep: Ember.computed.not('isGameInProgress'),

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

  amIPlayerOne: Ember.computed('participant.user.id', 'playerOne.user.id', function () {
    var participant = this.get('participant');
    var playerOne = this.get('playerOne');

    return participant.get('user.id') === playerOne.get('user.id');
  }),

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

  /** @property {String} class name for the show/hide chat icon */
  showChatClass: Ember.computed('showChat', function () {
    return this.get('showChat') ? 'chevron-right' : 'chevron-left';
  }),

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

  /** @property {Deck} the deck used by the participant */
  gameDeck: function () {
    var deckId = this.get('participant.deckId');
    var deck = this.get('session.user.gameReadyDecks').findBy('id', deckId);
    return deck;
  }.property('session.user.gameReadyDecks.[]', 'participant.deckId'),

  /**
   * Prepare the deck for play. Create game card models for each card in the
   * main deck, shuffle. By default, cards are put in the library.
   */
  initializeGameCards: function () {
    if (!this.get('hasChosenDeck')) {
      return;
    }
    var deck = this.get('gameDeck');
    var gameCards = [];

    deck.get('mainCardGroups').forEach((cardGroup) => {
      var card = cardGroup.get('card');
      var count = cardGroup.get('count');
      var i, gameCard;
      for (i = 0; i < count; i++) {
        gameCard = this.store.createRecord('gameCard');
        gameCard.set('card', card);
        gameCards.pushObject(gameCard);
      }
    });
    gameCards = shuffle(gameCards);
    // Initialize the order. The id of firebase records influences the order in
    // which it is saved in the database. If we don't give it an order, they'll
    // come back next time in the order the records were created.
    //
    var count = 0;
    gameCards.forEach((gameCard) => gameCard.set('order', count++));
    this.get('participant.gameCards').pushObjects(gameCards);
  },

  actions: {
    /**
     * Respond to a deck selection event.
     *
     * @param {Deck} deck   The selected deck model.
     */
    selectDeck: function (deck) {
      var participant = this.get('participant');
      participant.setProperties({
        deckName: deck.get('name'),
        deckId: deck.get('id')
      });
      this.get('model').save();
    },

    /**
     * Set the participant in the ready state
     */
    iAmReady: function () {
      var participant = this.get('participant');
      participant.set('isReady', true);
      this.initializeGameCards();
      this.get('model').save();
    },

    toggleChat: function () {
      this.toggleProperty('showChat');
    },

    drawHand: function () {
      var library = this.get('participant.cardsInLibrary').toArray();
      if (library.get('length') > 7) {
        for (var i = 0; i < 7; i++) {
          var card = library.objectAt(i);
          card.set('zone', 'hand');

        }
      } else {
        library.setEach('zone', 'hand');
      }
      this.get('model').save();
    },

    drawCard: function () {

    },

    shuffle: function () {

    },

    search: function () {

    },

    returnAllCards: function () {

    }
  }
});
