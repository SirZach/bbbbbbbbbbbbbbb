import Ember from 'ember';

export default Ember.Controller.extend({
  needs: ['user'],

  routeDidChange: function () {
    this.set('drawerOpen', false);
  }.observes('currentPath'),

  forceSidenavUnlocked: Ember.computed('currentPath', function () {
    return this.get('currentPath') === 'games.game';
  }),

  sidenavClassnames: Ember.computed('forceSidenavUnlocked', function () {
    var classNames = 'md-sidenav-left md-whiteframe-z2';
    if (this.get('forceSidenavUnlocked')) {
      classNames += ' force-unlocked';
    }
    return classNames;
  })
});
