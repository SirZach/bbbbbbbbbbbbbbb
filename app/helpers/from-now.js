import Ember from 'ember';

export function fromNow([value], options) {
  var includeSuffix = (options && options.includeSuffix);
  return moment(value).fromNow(!includeSuffix);
}

export default Ember.Helper.helper(fromNow);
