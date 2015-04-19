import Ember from 'ember';
import DS from 'ember-data';


var Log = Ember.Object.extend({
  createLogMessage: function (message, level) {
    var store = this.container.lookup('store:main');
    var session = this.container.lookup('session:main');
    var user = session.get('user.content');
    var logMessage = store.createRecord('log-message', {
      username: user && user.get('username'),
      userId: user && user.get('id'),
      message: message,
      level: level
    });
    var logMessageId = logMessage.get('id');
    logMessage.set('id', `${level}${logMessageId}`);
    console.error(logMessage.toJSON());
    return logMessage.save();
  },

  error: function (message) {
    return this.createLogMessage(message, 'error');
  },

  info: function (message) {
    return this.createLogMessage(message, 'info');
  }
});

export default {
  name: "Log",

  initialize: function (container, app) {
    app.register('log:main', Log);
    app.inject('component', 'log', 'log:main');
    app.inject('controller', 'log', 'log:main');
    app.inject('route', 'log', 'log:main');
  }
};
