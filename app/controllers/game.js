import Ember from 'ember';
import shuffle from '../utils/shuffle';
import GameCard from '../models/game-card';

export default Ember.Controller.extend({
  /** @property {Boolean} Is the game going? */
  isGameInProgress: function() {
    let players = this.get('players');
    return players.get('length') === 2 && players.every((player) => player && player.get('isReady'));
  }.property('players.@each.isReady'),

  isGameInPrep: Ember.computed.not('isGameInProgress'),

  /** @property {Boolean} Am I one of the players? */
  amIPlaying: function() {
    let playerUserIds = this.get('model.gameParticipants')
      .filterBy('isPlaying')
      .mapBy('user.id')
      .compact();
    let myId = this.get('session.user.id');
    return playerUserIds.contains(myId);
  }.property(
    'model.gameParticipants.@each.{isPlaying,userId}',
    'session.user.id'),

  amIPlayerOne: Ember.computed('participant.user.id', 'playerOne.user.id', function() {
    let participant = this.get('participant');
    let playerOne = this.get('playerOne');

    return participant && participant.get('user.id') === playerOne.get('user.id');
  }),

  /** @property {Boolean} don't let anyone not player one modify the game */
  notPlayerOne: Ember.computed.not('amIPlayerOne'),

  /** @property {GameParticipant} The participant representing me. */
  participant: function() {
    let participants = this.get('model.gameParticipants');
    let myId = this.get('session.user.id');
    return participants.findBy('user.id', myId);
  }.property('model.gameParticipants.@each.userId', 'session.user.id'),

  /**
   * @property {Array<GameParticipant>} The participants playing the game. The
   *                                    first player will be me if I am playing.
   *                                    It will be null if I am not playing and
   *                                    there is only one other player.
   */
  players: function() {
    let players = this.get('model.gameParticipants').filterBy('isPlaying');
    let amIPlaying = this.get('amIPlaying');
    let myId = this.get('session.user.id');
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

  playerOne: function() {
    return this.get('players')[0];
  }.property('players.@each'),

  playerOneAvatarUrl: function() {
    let playerOne = this.get('playerOne');
    if (playerOne) {
      return playerOne.get('user.avatarUrl');
    } else {
      return 'http://www.gravatar.com/avatar/?s=256&default=mm';
    }
  }.property('playerOne.user.avatarUrl'),

  playerTwo: function() {
    return this.get('players')[1];
  }.property('players.@each'),

  playerTwoAvatarUrl: function() {
    let playerTwo = this.get('playerTwo');
    if (playerTwo) {
      return playerTwo.get('user.avatarUrl');
    } else {
      return 'http://www.gravatar.com/avatar/?s=256&default=mm';
    }
  }.property('playerTwo.user.avatarUrl'),

  /** @property {Array<DS.Card>} array of DS.Cards composing the two decks */
  cardsInDecks: [],

  /** @observer Signals the route to load card models for this game. */
  playersAreReady: Ember.observer('playerOne.isReady', 'playerTwo.isReady',
    function() {
      this.send('playersReady');
    }
  ),

  /** @property {String} The title showing on the top half of the board. */
  topBoardTitle: function() {
    let isGameInPrep = this.get('isGameInPrep');
    let playerTwoUsername = this.get('playerTwo.user.username');
    let playerTwoIsReady = this.get('playerTwo.isReady');

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
  bottomBoardTitle: function() {
    let isGameInPrep = this.get('isGameInPrep');
    let amIPlaying = this.get('amIPlaying');
    let playerOneUsername = this.get('playerOne.user.username');
    let playerOneIsReady = this.get('playerOne.isReady');

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
  showChatClass: Ember.computed('showChat', function() {
    return this.get('showChat') ? 'chevron-right' : 'chevron-left';
  }),

  /** @property {Boolean} display the left column */
  showLeftColumn: false,

  /** @property {DS.GameParticipant} */
  leftColumnPlayer: null,

  /** @property {String} */
  leftColumnZone: null,

  /** @property {Array<DS.GameCard>} */
  leftColumnCards: Ember.computed('leftColumnPlayer', 'leftColumnZone', 'playerOne.gameCards.@each.zone', 'playerTwo.gameCards.@each.zone', function() {
    let player = this.get('leftColumnPlayer');
    let zone = this.get('leftColumnZone').capitalize();

    return player ? player.get(`cardsIn${zone}`) : [];
  }),

  /** @property {Boolean} a card is being dragged */
  cardIsDragging: false,

  /** @property {Boolean} has participant chosen a deck? */
  hasChosenDeck: Ember.computed.and('participant.deckName', 'participant.deckId'),

  /** @property {Boolean} participant can mark themselves ready */
  participantCanReady: function() {
    let amIPlaying = this.get('amIPlaying');
    if (!amIPlaying) {
      return false;
    }

    return this.get('hasChosenDeck') && !this.get('participant.isReady');
  }.property('amIPlaying', 'participant.isReady', 'hasChosenDeck'),

  /** @property {Deck} the deck used by the participant */
  gameDeck: function() {
    let deckId = this.get('participant.deckId');
    let deck = this.get('session.user.gameReadyDecks').findBy('id', deckId);
    return deck;
  }.property('session.user.gameReadyDecks.[]', 'participant.deckId'),

  /**
   * Prepare the deck for play. Create game card models for each card in the
   * main deck, shuffle. By default, cards are put in the library.
   */
  initializeGameCards() {
    if (!this.get('hasChosenDeck')) {
      return;
    }
    let deck = this.get('gameDeck');
    let gameCards = [];

    deck.get('mainCardGroups').forEach((cardGroup) => {
      let card = cardGroup.get('card');
      let count = cardGroup.get('count');
      let i, gameCard;
      for (i = 0; i < count; i++) {
        gameCard = GameCard.create();
        gameCard.set('cardId', card.get('id'));
        gameCards.pushObject(gameCard);
      }
    });
    gameCards = shuffle(gameCards);
    // Initialize the order. The id of firebase records influences the order in
    // which it is saved in the database. If we don't give it an order, they'll
    // come back next time in the order the records were created.
    //
    let count = 0;
    gameCards.forEach((gameCard) => gameCard.set('order', count++));
    this.set('participant.gameCards', gameCards);
  },

  /**
    * If a player selects End Game, redirect everyone back to the games list
    */
  statusChanged: Ember.observer('model.status', function() {
    if (this.get('model.status') === 'ended') {
      this.transitionToRoute('games.list');
    }
  }),

  /** @function get the game controller in a good state for another game */
  resetState() {
    this.setProperties({
      showChat: true,
      showLeftColumn: false,
      leftColumnPlayer: null,
      leftColumnZone: null,
      cardIsDragging: false
    });
  },

  actions: {
    /**
     * Respond to a deck selection event.
     *
     * @param {Deck} deck   The selected deck model.
     */
    selectDeck(deck) {
      if (!this.get('readOnly')) {
        let participant = this.get('participant');
        participant.setProperties({
          deckName: deck.get('name'),
          deckId: deck.get('id')
        });
        this.send('updateGame');
      }
    },

    /**
     * Set the participant in the ready state
     */
    iAmReady() {
      if (this.get('amIPlayerOne')) {
        let participant = this.get('participant');
        participant.set('isReady', true);
        this.initializeGameCards();
        this.send('updateGame');
      }
    },

    /**
     * Respond to chat submission.
     */
    submitChat() {
      let says = this.get('says');
      let channel = this.get('model.id');
      this.send('say', says, channel);
      this.set('says', null);
    },

    toggleChat() {
      this.toggleProperty('showChat');
    },

    /**
     * Open the left column for zone-card interaction
     * @param player
     * @param cards
     * @param zone
     */
    openLeftColumn(player, cards, zone) {
      if (this.get('amIPlayerOne')) {
        this.setProperties({
          leftColumnPlayer: player,
          leftColumnZone: zone,
          showLeftColumn: true
        });
      }
    },

    /**
     * Draw cards for player one.
     * Not surrounded with a readOnly check since it's disabled altogether in the template
     * @param numCards
     */
    drawCards(numCards) {
      let library = this.get('participant.cardsInLibrary').toArray();
      if (library.get('length') > numCards) {
        for (let i = 0; i < numCards; i++) {
          let card = library.objectAt(i);
          card.set('zone', 'hand');
        }
      } else {
        library.setEach('zone', GameCard.HAND);
      }

      this.send('updateGame');
    },

    /**
     * Shuffle the cards in player one's library
     * Not surrounded with a readOnly check since it's disabled altogether in the template
     */
    shuffle() {
      let library = this.get('participant.cardsInLibrary');
      let count = 0;

      shuffle(library);
      library.forEach((gameCard) => gameCard.set('order', count++));

      this.notifications.addNotification({
        message: 'Library cards shuffled',
        type: 'success',
        autoClear: true,
        clearDuration: 1200
      });

      this.send('updateGame');
    },

    /**
     * Send all cards from all the game zones back to the library, mainly utilized for a mulligan
     * Not surrounded with a readOnly check since it's disabled altogether in the template
     */
    returnAllCards() {
      if (this.get('amIPlayerOne')) {
        let participantGameCards = this.get('participant.gameCards');
        participantGameCards.forEach((gameCard) => gameCard.setProperties({
          zone: GameCard.LIBRARY,
          isTapped: false
        }));

        this.send('updateGame');
      }
    },

    /**
      * Increment or decrement life
      */
    changeLife(delta) {
      if (this.get('amIPlayerOne')) {
        let participant = this.get('participant');
        let life = participant.get('life');

        participant.set('life', life += delta);
        this.send('updateGame');
      }
    },

    droppedCard(cardData, player, zone) {
      if (this.get('amIPlayerOne')) {
        let gameCard = player.get('gameCards').findBy('id', cardData.id);

        gameCard.setProperties({
          zone,
          isTapped: false
        });
        this.send('updateGame');
      }
    },

    /**
     * Tap or untap a card.
     *
     * @param {GameCard} gameCard
     */
    tap(gameCard) {
      if (this.get('amIPlayerOne')) {
        gameCard.toggleProperty('isTapped');
        this.send('updateGame');
      }
    },

    /**
      * A player has called it quits!
      */
    endGame() {
      let game = this.get('model');
      game.set('status', 'ended');
      this.send('updateGame');
    }
  }
});
