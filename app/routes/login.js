import Ember from 'ember';

export default Ember.Route.extend({

  beforeModel() {
    if (this.get('session.isAuthenticated')) {
      this.replaceWith('/');
    }
  },

  actions: {
    willTransition(transition) {
      this.controller.setProperties({
        signupUsername: null,
        signupEmail: null,
        signupPassword: null,
        loginEmail: null,
        loginPassword: null
      });
    }
  }
});
