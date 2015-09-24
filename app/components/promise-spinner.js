import Ember from 'ember';

let PromiseController = Ember.Controller.extend(Ember.PromiseProxyMixin);

export default Ember.Component.extend({
  promiseSpinnerUrls: Ember.inject.service('promise-spinner-urls'),

  /** @property {PromiseController} houses the promise */
  promiseController: null,

  fetchOnBeginning: function() {
    this.retrieveData();
  }.on('didInsertElement'),

  retrieveData() {
    let url = this.get('url');
    let promiseSpinnerUrls = this.get('promiseSpinnerUrls');
    let dataFound = promiseSpinnerUrls.hasData(url);
    let promiseController;

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

  // Why do I need this?
  urlChanged: function() {
    this.retrieveData();
  }.observes('url')
});
