import Ember from 'ember';

export function fromX(params, options) {
  var includeSuffix = (options && options.includeSuffix);
  return moment(params[0]).from(params[1], !includeSuffix);
}

export default Ember.HTMLBars.makeBoundHelper(fromX);
