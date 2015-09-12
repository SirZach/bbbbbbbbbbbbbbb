import Ember from 'ember';
const { get, computed } = Ember;

export default Ember.Component.extend({
  /** @property {Array} the array of iterables */
  content: [],

  /** @property {Number} index of current iterable */
  index: null,

  /** @property {Boolean} is current iterable last in the content */
  isLast: computed('index', 'content', function () {
    let content = get(this, 'content');
    let index = get(this, 'index');

    return index === get(content, 'length') - 1;
  }),

  notLast: computed.not('isLast')
});
