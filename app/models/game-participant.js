import DS from 'ember-data';
import Ember from 'ember';

export default DS.Model.extend({
  /** @property {User} Reference to the user record. */
  user: DS.belongsTo('user', {async: true}),

  /** @property {Boolean} Is this person a player (or a watcher)? */
  isPlaying: DS.attr('boolean', {defaultValue: false}),

  /** @property {Boolean} Is this person online and in the game room? */
  isPresent: DS.attr('boolean', {defaultValue: true}),

  /** @property {String} The name of the deck being used. */
  deckName: DS.attr('string'),

  /** @property {String} The identifier of the deck being used. */
  deckId: DS.attr('string'),

  /** @property {Array<GameCard>} Embedded array of game card objects. */
  gameCards: DS.hasMany('gameCard', {embedded: true}),

  /** @property {Boolean} Is the player ready to play the game? */
  isReady: DS.attr('boolean', {defaultValue: false}),

  /** @property {Number} Life total. */
  life: DS.attr('number'),

  /** @property {String} Convenience property for computed dependencies. */
  userId: Ember.computed.alias('user.id')
});
