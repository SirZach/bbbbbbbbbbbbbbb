import Ember from 'ember';

export default Ember.Route.extend({
  // TODO: insert yourself into the watchers array unless you're already in one
  // of the user arrays. Probably makes sense to do in the afterModel hook.

  beforeModel: function () {
    if (!this.get('session.isAuthenticated')) {
      this.replaceWith('/');
    }
  }
});
