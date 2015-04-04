import Ember from 'ember';

export function fromNow(params, options) {
  return moment(params[0]).fromNow(!options.includeSuffix);
}

export default Ember.HTMLBars.makeBoundHelper(fromNow);
