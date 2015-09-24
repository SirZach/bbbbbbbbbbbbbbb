import Ember from 'ember';
const { inject, computed } = Ember;

export default Ember.Controller.extend({
  userController: inject.controller('user'),

  routeDidChange: function() {
    this.set('drawerOpen', false);
  }.observes('currentPath'),

  /**
   * @property {Boolean}
   * Should the side nav be unlocked regardless of viewport width?
   */
  forceSidenavUnlocked: computed('currentPath', function() {
    return this.get('currentPath') === 'game';
  }),

  /** @property {Boolean} Classes to apply to the side nav container. */
  navContainerClassnames: computed('forceSidenavUnlocked', function() {
    let classNames = 'ember-app';
    if (this.get('forceSidenavUnlocked')) {
      classNames += ' force-unlocked';
    }
    return classNames;
  })
});
