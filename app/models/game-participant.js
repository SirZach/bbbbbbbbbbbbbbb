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

  gameCards: Ember.computed('gameCardsRaw', function (key, value) {
    // setter
    if (arguments.length > 1) {
      this.set('gameCardsRaw', JSON.stringify(value));
      return value;
    }

    // getter
    var gameCardsRaw = this.get('gameCardsRaw');

    if (!gameCardsRaw) { return [];}

    return JSON.parse(gameCardsRaw).map((r) => GameCard.create(r));
  }),

  /** @property {Array<GameCard>} all the cards in hand */
  cardsInHand: Ember.computed('gameCards.@each.zone', function () {
    return this.get('gameCards').filterBy('zone', 'hand');
  }),

  /** @property {Array<GameCard>} all the cards in library */
  cardsInLibrary: Ember.computed('gameCards.@each.zone', function () {
    return this.get('gameCards').filterBy('zone', 'library').sortBy('order');
  }),

  /** @property {Array<GameCard>} all the cards in graveyard */
  cardsInGraveyard: Ember.computed('gameCards.@each.zone', function () {
    return this.get('gameCards').filterBy('zone', 'graveyard');
  }),

  /** @property {Array<GameCard>} all the cards in exile */
  cardsInExile: Ember.computed('gameCards.@each.zone', function () {
    return this.get('gameCards').filterBy('zone', 'exile');
  }),

  setGameCardsRaw: function () {
    var gameCards = this.get('gameCards');
    if (gameCards) {
      this.set('gameCardsRaw', JSON.stringify(gameCards));
    }
  }
});
