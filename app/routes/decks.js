import Ember from 'ember';

export default Ember.Route.extend({
  beforeModel: function () {
    if (!this.get('isAuthenticated')) {
      this.replaceWith('/');
    }
  },

  model: function () {
    return this.store.find('deck', {
      orderBy: 'name',
      equalTo: this.get('session.currentUser.github.username')
    });
  }
});
