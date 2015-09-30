import Ember from 'ember';

export default Ember.Controller.extend({
  actions: {
    login() {
      let email = this.get('loginEmail');
      let password = this.get('loginPassword');
      this.set('loginError');
      this.session.loginWithPassword(email, password).then(
        () => this.transitionToRoute('/'),
        (error) => {
          this.notifications.addNotification({
            message: error.message,
            type: 'error'
          });
        });
    },

    signup() {
      let username = this.get('signupUsername');
      let email = this.get('signupEmail');
      let password = this.get('signupPassword');
      this.session.signupWithPassword(username, email, password).then(
        () => this.transitionToRoute('/'),
        (error) => {
          this.notifications.addNotification({
            message: error.message,
            type: 'error'
          });
        });
    }
  }
});
