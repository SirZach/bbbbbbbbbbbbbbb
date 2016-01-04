import Ember from 'ember';

const { Route, get, inject } = Ember;

export default Route.extend({
  session: inject.service(),

  actions: {
    cancel() {
      this.transitionTo('login');
    },

    resetPassword() {
      const email = get(this, 'controller.loginEmail');
      const ref = get(this, 'session.ref');
      const { notifications } = this;

      ref.resetPassword({ email }, function(error) {
        if (error === null) {
          notifications.addNotification({
            message: 'Password reset email sent.',
            type: 'success'
          });
        } else {
          notifications.addNotification({
            message: 'Error resetting password.',
            type: 'error'
          });
        }
      });
    }
  }
});
