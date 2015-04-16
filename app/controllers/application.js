import Ember from 'ember';

export default Ember.Controller.extend({
  needs: ['user'],

  routeDidChange: function () {
    this.set('drawerOpen', false);
  }.observes('currentPath')
});
