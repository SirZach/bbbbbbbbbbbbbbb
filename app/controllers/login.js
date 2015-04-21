import Ember from 'ember';

export default Ember.Controller.extend({
  loginError: null,

  actions: {
    login: function () {
      var email = this.get('loginEmail');
      var password = this.get('loginPassword');
      this.set('loginError');
      this.session.loginWithPassword(email, password).then(
        () => this.transitionTo('/'),
        (error) => this.set('loginError', error));
    },

    signup: function () {
      var username = this.get('signupUsername');
      var email = this.get('signupEmail');
      var password = this.get('signupPassword');
      this.session.signupWithPassword(username, email, password).then(
        () => this.transitionTo('/'),
        (error) => {
          this.notifications.addNotification({
            message: error.message,
            type: 'error'
          });
        });
    }
  }
});
