import Ember from 'ember';

export default Ember.Component.extend({
  isPending: true,

  promiseValue: null,

  fetchOnBeginning: function () {
    this.retrieveData();
  }.on('init'),

  retrieveData: function () {
    var url = this.get('url');
    var self = this;
    this.set('isPending', true);
    Ember.$.ajax({
      url: url
    }).then(function (data) {
      self.setProperties({
        isPending: false,
        promiseValue: data ? data : "No price found"
      });
    }, function (error) {
      console.log('error');
      console.log(error);
      self.setProperties({
        isPending: false,
        promiseValue: ":("
      });
    });
  },

  urlChanged: function () {
    this.retrieveData();
  }.observes('url')
});
