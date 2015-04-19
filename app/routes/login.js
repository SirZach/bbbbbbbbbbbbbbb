import Ember from 'ember';

export default Ember.Route.extend({

  beforeModel: function () {
    if (this.get('session.isAuthenticated')) {
      this.replaceWith('/');
    }
  },

  actions: {
    loginAsGuest: function () {
      this.controllerFor('session').setProperties({
        isAuthenticated: true,
        authenticationType: 'guest'
      });

      this.transitionTo('decks');
    }
  }
});
