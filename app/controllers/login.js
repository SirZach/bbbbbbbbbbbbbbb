import Ember from 'ember';

export default Ember.Controller.extend({
  loginError: null,

  signupError: null,

  actions: {
    login: function () {
      var email = this.get('loginEmail');
      var password = this.get('loginPassword');
      this.set('loginError');
      this.session.loginWithPassword(email, password).then(
        () => this.transitionTo('/'),
        () => this.set('loginError', error));
    },

    signup: function () {
      var username = this.get('signupUsername');
      var email = this.get('signupEmail');
      var password = this.get('signupPassword');
      this.set('signupError');
      this.session.signupWithPassword(username, email, password).then(
        () => this.transitionTo('/'),
        () => this.set('signupError', error));
    }
  }
});
