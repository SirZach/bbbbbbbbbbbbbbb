import Ember from 'ember';

export default Ember.Controller.extend({
  needs: ['user'],

  routeDidChange: function () {
    this.set('drawerOpen', false);
  }.observes('currentPath'),

  /**
   * @property {Boolean}
   * Should the side nav be unlocked regardless of viewport width?
   */
  forceSidenavUnlocked: Ember.computed('currentPath', function () {
    return this.get('currentPath') === 'game';
  }),

  /** @property {Boolean} Classes to apply to the side nav container. */
  navContainerClassnames: Ember.computed('forceSidenavUnlocked', function () {
    var classNames = 'ember-app';
    if (this.get('forceSidenavUnlocked')) {
      classNames += ' force-unlocked';
    }
    return classNames;
  })
});
