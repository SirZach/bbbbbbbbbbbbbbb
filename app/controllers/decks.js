import Ember from 'ember';

export default Ember.ArrayController.extend({
  queryParams: ['mine'],

  /** @property {Boolean} Query param - filter by my decks only? */
  mine: false
});
