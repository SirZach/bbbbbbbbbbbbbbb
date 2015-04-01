import Ember from 'ember';

export function fromNow(params) {
  return moment(params[0]).fromNow();
}

export default Ember.HTMLBars.makeBoundHelper(fromNow);
