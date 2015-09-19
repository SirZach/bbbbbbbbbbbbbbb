import Ember from 'ember';

export default Ember.HTMLBars.makeBoundHelper(function(params) {
  let value = params[0];
  return value ? value.pluralize() : value;
});
