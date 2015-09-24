import Ember from 'ember';
import DS from 'ember-data';

let Log = Ember.Object.extend({
  createLogMessage(message, level) {
    let store = this.container.lookup('store:main');
    let session = this.container.lookup('session:main');
    let user = session.get('user.content');
    let logMessage = store.createRecord('log-message', {
      username: user && user.get('username'),
      userId: user && user.get('id'),
      message,
      level
    });
    let logMessageId = logMessage.get('id');
    logMessage.set('id', `${level}${logMessageId}`);
    console.error(logMessage.toJSON());
    return logMessage.save();
  },

  error(message) {
    return this.createLogMessage(message, 'error');
  },

  info(message) {
    return this.createLogMessage(message, 'info');
  }
});

export default {
  name: 'Log',

  initialize(container, app) {
    app.register('log:main', Log);
    app.inject('component', 'log', 'log:main');
    app.inject('controller', 'log', 'log:main');
    app.inject('route', 'log', 'log:main');
  }
};
