import Ember from 'ember';

const { Route, get } = Ember;

export default Route.extend({
  afterModel(user) {
    // we care about this because you can't change your password on a social login
    if (!get(user, 'email')) {
      this.transitionTo('user.index');
    } else if (get(user, 'id') !== get(this, 'session.user.id')) {
      this.transitionTo('user.index');
    }
  },

  actions: {
    willTransition() {
      get(this, 'controller').setProperties({
        oldPassword: null,
        newPassword: null
      });
    },

    changePassword() {
      let oldPassword = get(this, 'controller.oldPassword');
      let newPassword = get(this, 'controller.newPassword');
      let user = get(this, 'controller.model');

      if (oldPassword && newPassword) {
        let ref = get(this, 'session.ref');
        const { notifications } = this;

        ref.changePassword({
          email: get(user, 'email'),
          oldPassword,
          newPassword
        }, function (error) {
          if (error) {
            switch (error.code) {
              case "INVALID_PASSWORD":
                notifications.addNotification({
                  message: 'The specified user account password is incorrect.',
                  type: 'error'
                });
                break;
              case "INVALID_USER":
                notifications.addNotification({
                  message: 'The specified user account does not exist.',
                  type: 'error'
                });
                break;
              default:
                notifications.addNotification({
                  message: 'Error changing password.',
                  type: 'error'
                });
            }
          } else {
            notifications.addNotification({
              message: 'Password Changed.',
              type: 'success',
              autoClear: true,
              clearDuration: 1200
            });
          }
        });
      }
    }
  }
});
