import Ember from 'ember';

export default Ember.Controller.extend({
  needs: ['decks'],

  /** @property {Boolean} Is the filters column enabled? */
  filtersActive: false,

  /** @property {Boolean} Showing only my decks? */
  mineOnly: Ember.computed('controllers.decks.owner', 'session.user.username',
    function (key, val) {
      var me = this.get('session.user.username');
      var owner = this.get('controllers.decks.owner');

      if (arguments.length === 1) {
        // Getter; check to see if I am the owner being filtered.
        return owner === me;
      } else {
        // Setter; set the deck controller's owner property.
        this.set('controllers.decks.owner', val ? me : null);
      }
    }),

  actions: {
    toggleFiltersActive: function () {
      this.toggleProperty('filtersActive');
    }
  }
});
