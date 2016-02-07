import Ember from 'ember';
const { inject, computed } = Ember;

export default Ember.Controller.extend({
  decksController: inject.controller('decks'),

  /** @property {Boolean} Is the filters column enabled? */
  filtersActive: computed.alias('decksController.filtersActive'),

  /** @property {Boolean} Showing only my decks? */
  filterMineOnly: computed.alias('decksController.mine')
});
