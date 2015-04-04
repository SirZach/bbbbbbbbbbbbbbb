import Ember from 'ember';

export function fromNow(params, options) {
  var includeSuffix = (options && options.includeSuffix);
  return moment(params[0]).fromNow(!includeSuffix);
}

export default Ember.HTMLBars.makeBoundHelper(fromNow);
