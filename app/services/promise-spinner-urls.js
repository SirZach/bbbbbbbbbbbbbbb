import Ember from 'ember';

export default Ember.Service.extend({
  store: Ember.Object.create(),

  hasData: function (url) {
    return this.get(`store.${url}`);
  }
});
