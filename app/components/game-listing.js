import Ember from 'ember';
import layout from '../templates/components/game-listing';

export default Ember.Component.extend({
  layout: layout,

  matchup: function () {
    var players = this.get('game.players');
    if (!players) {
      return '';
    }
    var names = players.mapBy('username');
    if (names.length < 2) {
      names.push('?');
    }
    return names.join(' vs. ');
  }.property('game.players.@each')
});
