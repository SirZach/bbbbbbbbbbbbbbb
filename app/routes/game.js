import Ember from 'ember';

export default Ember.Route.extend({
  afterModel: function (model) {
    // If you are not logged in, allow anonymous access to the game.
    if (!this.get('session.isAuthenticated')) {
      return;
    }

    // By default, add yourself as a watcher unless you're already in the
    // participants list.
    //
    var gameParticipants = model.get('gameParticipants');
    var user = this.get('session.user');
    var store = this.store;
    var gameParticipant;
    // Fetch all users to see if we are one of them.
    var promises = [user].concat(gameParticipants.mapBy('user'));
    return Ember.RSVP.all(promises).then((users) => {
      var me = users.shift();
      var myId = me.get('id');
      var userIds = users.mapBy('id');
      if (!userIds.contains(user.get('id'))) {
        gameParticipant = store.createRecord('gameParticipant');
        gameParticipant.set('user', user);
        gameParticipants.pushObject(gameParticipant);
      } else {
        gameParticipant = gameParticipants.find((participant) => {
          return participant.get('user.id') === myId;
        });
      }
      gameParticipant.set('isPresent', true);
      this.set('gameParticipant', gameParticipant);
      // Queue the participant disconnect behavior.
      var participantRef = this.get('gameParticipantRef');
      // Simply mark as not present. We don't want to destroy participants if
      // they happen to actually be playing.
      participantRef.child('isPresent').onDisconnect().set(false);

      // Save the model with the new participant state.
      return model.save();
    });
  },

  setupController: function (controller, game) {
    this._super.apply(this, arguments);

    var store = this.store;
    store.find('chat', {
      orderBy: 'channel',
      equalTo: game.id
    }).then(function () {
      var gameChats = store.filter('chat', function (chat) {
        return chat.get('channel') === game.id;
      });

      controller.set('chats', gameChats);
    });
  },

  gameParticipantRef: function () {
    return this.store.refFor('game', this.modelFor('game'))
      .child('gameParticipants')
      .child(this.get('gameParticipant.id'));
  }.property('gameParticipant'),

  actions: {
    willTransition: function () {
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
    joinAsPlayer: function () {
      var user = this.get('session.user');
      var gameParticipantsRef = this.store.refFor('game', this.modelFor('game'))
        .child('gameParticipants');
      gameParticipantsRef.transaction((gameParticipants) => {
        // Try to add myself as a player. Check first that there are not two
        // players already present.
        //
        var numPlayers = 0;
        var myParticipant;
        for (var id in gameParticipants) {
          if (gameParticipants.hasOwnProperty(id)) {
            var participant = gameParticipants[id];
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
