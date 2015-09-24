import DS from 'ember-data';
import Ember from 'ember';
import GameCard from './game-card';

export default DS.Model.extend({
  /** @property {User} Reference to the user record. */
  user: DS.belongsTo('user', {async: true}),

  /** @property {Boolean} Is this person a player (or a watcher)? */
  isPlaying: DS.attr('boolean', {defaultValue: false}),

  /** @property {Boolean} Is this person online and in the game room? */
  isPresent: DS.attr('boolean', {defaultValue: true}),

  /** @property {Boolean} Is this person ready to play? */
  isReady: DS.attr('boolean', {defaultValue: false}),

  /** @property {String} The name of the deck being used. */
  deckName: DS.attr('string'),

  /** @property {String} The identifier of the deck being used. */
  deckId: DS.attr('string'),

  /** @property {String} Serialized form of game cards. */
  gameCardsRaw: DS.attr('string'),

  /** @property {Number} Life total. */
  life: DS.attr('number'),

  /** @property {String} Convenience property for computed dependencies. */
  userId: Ember.computed.alias('user.id'),

  gameCards: Ember.computed('gameCardsRaw', {
    get() {
      var gameCardsRaw = this.get('gameCardsRaw');
      var gameCards = this.get('_gameCards');

      if (!gameCardsRaw) {
        return [];
      }

      if (gameCards) {
        // Merge the given properties instead of creating new objects.
        JSON.parse(gameCardsRaw).forEach(raw => {
          var gameCard = gameCards.findBy('id', raw.id);
          if (!gameCard) {
            // If a new token was just created, add it to the list.
            gameCard = GameCard.create();
            gameCards.pushObject(gameCard);
          }
          gameCard.setProperties(raw);
        });
      } else {
        // Create new objects.
        gameCards = JSON.parse(gameCardsRaw).map(raw => GameCard.create(raw));
        this.set('_gameCards', gameCards);
      }
      return gameCards;
    },
    set(key, value) {
      this.set('gameCardsRaw', JSON.stringify(value));
      this.set('_gameCards', value);
      return value;
    }
  }),

  /** @property {Array<DS.GameCard>} all the cards in hand */
  cardsInHand: Ember.computed('gameCards.@each.zone', function() {
    return this.get('gameCards').filterBy('zone', GameCard.HAND);
  }),

  /** @property {Array<DS.GameCard>} all the cards in library */
  cardsInLibrary: Ember.computed('gameCards.@each.zone', function() {
    return this.get('gameCards').filterBy('zone', GameCard.LIBRARY).sortBy('order');
  }),

  /** @property {Array<DS.GameCard>} all the cards in graveyard */
  cardsInGraveyard: Ember.computed('gameCards.@each.zone', function() {
    return this.get('gameCards').filterBy('zone', GameCard.GRAVEYARD);
  }),

  /** @property {Array<DS.GameCard>} all the cards in exile */
  cardsInExile: Ember.computed('gameCards.@each.zone', function() {
    return this.get('gameCards').filterBy('zone', GameCard.EXILE);
  }),

  /** @property {Array<DS.GameCard>} all the cards on the battlefield */
  cardsInBattlefield: Ember.computed('gameCards.@each.zone', function() {
    return this.get('gameCards').filterBy('zone', GameCard.BATTLEFIELD);
  }),

  setGameCardsRaw: function() {
    var gameCards = this.get('gameCards');
    if (gameCards) {
      this.set('gameCardsRaw', JSON.stringify(gameCards));
    }
  }
});
