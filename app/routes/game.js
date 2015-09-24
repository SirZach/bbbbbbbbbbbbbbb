import Ember from 'ember';
import GameCard from '../models/game-card';

export default Ember.Route.extend({
  /**
   * Retrieves card models that are in the given game.
   *
   * @return {Promise} Resolves with Array<Card>
   */
  retrieveDSCards (game) {
    let controller = this.controllerFor('game');
    let store = this.store;
    //load all the real card models into the store for future use
    let players = game.get('players');
    let promises = players.reduce((prev, p) => {
      let gameCards = Ember.get(p, 'gameCards') || [];
      prev = prev.concat(gameCards.filter((card) => !card.isToken).map((card) => store.find('card', card.cardId)));
      return prev;
    }, []);

    return Ember.RSVP.all(promises).then(cards => controller.set('cardsInDecks', cards.uniq()));
  },

  afterModel: function(model) {
    let store = this.store;

    // If you are not logged in, allow anonymous access to the game.
    if (!this.get('session.isAuthenticated')) {
      return this.retrieveDSCards(model);
    }

    // By default, add yourself as a watcher unless you're already in the
    // participants list.
    //
    let gameParticipants = model.get('gameParticipants');
    let user = this.get('session.user');
    let gameParticipant;
    // Fetch all users to see if we are one of them.
    let promises = [user].concat(gameParticipants.mapBy('user'));

    return Ember.RSVP.all(promises).then((users) => {
      let me = users.shift();
      let myId = me.get('id');
      let userIds = users.mapBy('id');
      if (!userIds.contains(user.get('id'))) {
        gameParticipant = store.createRecord('game-participant');
        gameParticipant.setProperties({
          user: user,
          life: 20
        });
        gameParticipants.pushObject(gameParticipant);
      } else {
        gameParticipant = gameParticipants.find((participant) => {
          return participant.get('user.id') === myId;
        });
      }
      gameParticipant.set('isPresent', true);
      this.set('gameParticipant', gameParticipant);
      // Queue the participant disconnect behavior.
      let participantRef = this.get('gameParticipantRef');
      // Simply mark as not present. We don't want to destroy participants if
      // they happen to actually be playing.
      participantRef.child('isPresent').onDisconnect().set(false);
      model.on('didDelete', () => {
        // Don't set not present if the model was deleted. Otherwise we'll end
        // up with a zombie game record in firebase.
        //
        participantRef.child('isPresent').onDisconnect().remove();
      });

      // Save the model with the new participant state.
      return model.save();
    })
    .then(model => this.retrieveDSCards(model));
  },

  setupController: function(controller, game) {
    this._super.apply(this, arguments);

    //TODO: move this to the route, duh
    let store = this.store;
    store.find('chat', {
      orderBy: 'channel',
      equalTo: game.id
    }).then(function() {
      let gameChats = store.filter('chat', function(chat) {
        return chat.get('channel') === game.id;
      });

      controller.set('chats', gameChats);
    });

    controller.resetState();
  },

  gameParticipantRef: function() {
    return this.modelFor('game')
      .ref()
      .child('gameParticipants')
      .child(this.get('gameParticipant.id'));
  }.property('gameParticipant'),

  actions: {
    /**
     * Load the card models.
     */
    playersReady() {
      this.retrieveDSCards(this.currentModel);
    },

    showToken: function(player) {
      let gameCards = player.get('gameCards');
      let createTokenController = this.controllerFor('game/create-token');
      let gameCard = GameCard.create({
        order: gameCards.length + 1,
        zone: GameCard.BATTLEFIELD,
        isToken: true
      });

      createTokenController.setProperties({
        player: player,
        game: this.modelFor('game')
      });
      this.send('openModal', 'game/create-token', gameCard);
    },

    dragStarted: function() {
      this.set('controller.cardIsDragging', true);
    },

    dragEnded: function() {
      this.set('controller.cardIsDragging', false);
    },

    /**
     * Use this action for all game saves as a mediocre approach to handling security
     */
    updateGame: function() {
      let controller = this.get('controller');
      let game = controller.get('model');

      if (controller.get('amIPlayerOne')) {
        game.save();
      } else {
        game.rollback();
      }
    },

    /**
     * Close the left column
     */
    closeLeftColumn: function() {
      let controller = this.get('controller');

      controller.setProperties({
        leftColumnPlayer: null,
        leftColumnZone: null,
        showLeftColumn: false
      });
    },

    willTransition: function() {
      this.get('controller').resetState();

      // If you are not logged in, there is no state to clean up.
      if (!this.get('session.isAuthenticated')) {
        return;
      }

      // Set directly with the Firebase API so we don't mess up the rest of the
      // game state.
      this.get('gameParticipantRef').child('isPresent').set(false);
    },

    /**
     * Join this game as a player if possible. Use the Firebase transaction API
     * to atomically alter the list of playing participants.
     */
    joinAsPlayer: function() {
      let user = this.get('session.user');
      let gameParticipantsRef = this.store.refFor('game', this.modelFor('game'))
        .child('gameParticipants');
      gameParticipantsRef.transaction((gameParticipants) => {
        // Try to add myself as a player. Check first that there are not two
        // players already present.
        //
        let numPlayers = 0;
        let myParticipant;
        for (let id in gameParticipants) {
          if (gameParticipants.hasOwnProperty(id)) {
            let participant = gameParticipants[id];
            if (participant.isPlaying) {
              numPlayers++;
            }
            if (participant.user === user.get('id')) {
              myParticipant = participant;
            }
          }
        }
        if (numPlayers > 1 || !myParticipant) {
          // We cannot join. Enough players already exist or we messed up.
          return;
        }
        myParticipant.isPlaying = true;
        return gameParticipants;
      }, (error, committed) => {
        if (error) {
          this.log.error(`Error joining game: ${error}`);
          this.notifications.addNotification({
            message: 'Error joining game.',
            type: 'error',
            autoClear: true,
            clearDuration: 3000
          });
        }
      });

    }
  }
});
