import Ember from 'ember';

export default Ember.Service.extend({
  store: Ember.Object.create(),

  hasData(url) {
    return this.get('store').get(url.replace(/\./g, '-'));
  }
});
