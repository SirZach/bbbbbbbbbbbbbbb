import DS from 'ember-data';

export default DS.Model.extend({
    username: DS.attr('string'),
    avatarUrl: DS.attr('string'),
    displayName: DS.attr('string'),
    email: DS.attr('string'),
    visits: DS.attr('number', {defaultValue: 0}),
    presence: DS.belongsTo('presence', {async: true}),
    isAnonymous: DS.attr('boolean', {defaultValue: true}),
    decks: DS.hasMany('deck', {async: true}),

    /** @property {Boolean} Does this user have a deck that is game-ready? */
    hasGameReadyDecks: function () {
      var decks = this.get('decks');
      return decks.filterBy('isGameReady').length > 0;
    }.property('decks.@each.isGameReady')
});
