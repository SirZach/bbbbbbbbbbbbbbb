import Ember from 'ember';

const { Route, get } = Ember;

export default Route.extend({
  beforeModel(transition) {
    if (!get(this, 'session.isAuthenticated')) {
      this.transitionTo('application');
    }
  }
});
