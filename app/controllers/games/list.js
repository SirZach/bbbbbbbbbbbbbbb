import Ember from 'ember';

export default Ember.Controller.extend({
  /** @property {Boolean} A combo of being signed up and having decks ready. */
  canCreateGame: function () {
    return !Ember.isNone(this.get('session.user'));
  }.property('session.user'),

  cannotCreateGame: Ember.computed.not('canCreateGame'),

  /** @property {Array<Game>} all the games that haven't been ended */
  joinableGames: Ember.computed('model.@each.status', function () {
    return this.get('model').filter((game) => game.get('status') !== 'ended');
  })
});
