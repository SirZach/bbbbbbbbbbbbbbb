import Ember from 'ember';

export default Ember.Route.extend({
  model: function () {
    return this.store.filter('game', {
      orderBy: 'createdDate'
    }, function () {
      return true;
    });
  },

  redirect: function () {
    this.transitionTo('games.list');
  }
});
