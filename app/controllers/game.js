import Ember from 'ember';

export default Ember.Controller.extend({
  /** @property {Boolean} Is the game going? */
  isGameInProgress: Ember.computed.equal('model.status', 'in-play'),

  /** @property {Boolean} The game hasn't started yet? */
  isGameInPrep: Ember.computed.equal('model.status', 'preparing'),

  /** @property {Boolean} Is the game over? */
  isGameOver: Ember.computed.equal('model.status', 'ended'),

  canParticipate: Ember.computed.readOnly('session.isAuthenticated'),

  cannotParticipate: Ember.computed.not('canParticipate'),

  /** @property {Boolean} Am I one of the players? */
  amIPlaying: function () {
    var playerUserIds = this.get('model.players').mapBy('user.id');
    var myId = this.get('session.user.id');
    return playerUserIds.contains(myId);
  }.property('model.players.@each.user.id', 'session.user.id'),

  /** @property {GameParticipant} The participant representing me. */
  participant: function () {
    var participants = this.get('model.gameParticipants');
    var myId = this.get('session.user.id');
    return participants.findBy('user.id', myId);
  }.property('model.gameParticipants.@each.user.id', 'session.user.id'),

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
