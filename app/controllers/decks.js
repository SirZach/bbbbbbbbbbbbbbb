import Ember from 'ember';

export default Ember.ArrayController.extend({
  queryParams: ['owner'],

  /** @property {String} Query param - whose decks by which we filter. */
  owner: null
});
