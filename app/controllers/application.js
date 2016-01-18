import Ember from 'ember';
const { inject, computed } = Ember;

export default Ember.Controller.extend({
  userController: inject.controller('user')

  /**
    We may need this code again as the behavior may have broken with ember-paper 0.2.10 update
  */
  // routeDidChange: function() {
  //   this.set('drawerOpen', false);
  // }.observes('currentPath'),
  //
  // /**
  //  * @property {Boolean}
  //  * Should the side nav be unlocked regardless of viewport width?
  //  */
  // forceSidenavUnlocked: computed('currentPath', function() {
  //   return this.get('currentPath') === 'game';
  // }),
  //
  // /** @property {Boolean} Classes to apply to the side nav container. */
  // navContainerClassnames: computed('forceSidenavUnlocked', function() {
  //   let classNames = 'ember-app';
  //   if (this.get('forceSidenavUnlocked')) {
  //     classNames += ' force-unlocked';
  //   }
  //   return classNames;
  // })
});
