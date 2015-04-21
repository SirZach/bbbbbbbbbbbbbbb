import Ember from 'ember';

var PromiseController = Ember.Controller.extend(Ember.PromiseProxyMixin);

export default Ember.Component.extend({
  /** @property {PromiseController} houses the promise */
  promiseController: null,

  fetchOnBeginning: function () {
    this.retrieveData();
  }.on('didInsertElement'),

  retrieveData: function () {
    var url = this.get('url');
    var promiseController = PromiseController.create({
      promise: Ember.$.getJSON(url)
    });

    this.set('promiseController', promiseController);
  },

  //Why do I need this?
  urlChanged: function () {
    this.retrieveData();
  }.observes('url')
});
