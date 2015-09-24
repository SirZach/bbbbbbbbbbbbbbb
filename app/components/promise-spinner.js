import Ember from 'ember';

var PromiseController = Ember.Controller.extend(Ember.PromiseProxyMixin);

export default Ember.Component.extend({
  promiseSpinnerUrls: Ember.inject.service('promise-spinner-urls'),

  /** @property {PromiseController} houses the promise */
  promiseController: null,

  fetchOnBeginning: function() {
    this.retrieveData();
  }.on('didInsertElement'),

  retrieveData: function() {
    var url = this.get('url');
    var promiseSpinnerUrls = this.get('promiseSpinnerUrls');
    var dataFound = promiseSpinnerUrls.hasData(url);
    var promiseController;

    if (dataFound) {
      promiseController = PromiseController.create({
        promise: new Ember.RSVP.Promise(function(resolve, reject) {
          resolve(dataFound);
        })
      });
    } else {
      promiseController = PromiseController.create({
        promise: Ember.$.getJSON(url).then(function(data) {
          promiseSpinnerUrls.get('store').set(url.replace(/\./g, '-'), data);
          return data;
        })
      });
    }

    this.set('promiseController', promiseController);
  },

  //Why do I need this?
  urlChanged: function() {
    this.retrieveData();
  }.observes('url')
});
