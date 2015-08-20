import Ember from 'ember';

export default Ember.Controller.extend({
  needs: ['decks'],

  /** @property {Boolean} Is the filters column enabled? */
  filtersActive: Ember.computed.alias('controllers.decks.filtersActive'),

  /** @property {Boolean} Showing only my decks? */
  filterMineOnly: Ember.computed.alias('controllers.decks.mine')
});
