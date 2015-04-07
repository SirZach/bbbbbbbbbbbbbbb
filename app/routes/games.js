import Ember from 'ember';

export default Ember.Route.extend({
  beforeModel: function () {
    if (!this.get('session.isAuthenticated')) {
      this.replaceWith('/');
    }
  },

  model: function () {
    return this.store.filter('game', {
      orderBy: 'createdDate'
    }, function () {
      return true;
    });
  }
});
