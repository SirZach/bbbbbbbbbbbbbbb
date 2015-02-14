import Ember from 'ember';

export default Ember.Mixin.create({
  /** The number of items to add to the page when you scroll down to the bottom **/
  chunkSize: 10,

  /** The array you should iterate over **/
  iterable: [],

  /**
   * You should implement this method to look something like this...
   * repopulateIterable: function () {
      this._super();

      this.get('iterable').pushObjects(this.get('metrics').slice(0, this.get('chunkSize'))); //hydrating iterable when the model you care about changes
    }.observes('metrics.[]'),
   */
  repopulateIterable: function () {
    this.set('iterable', []);
  },

  /**
   * Returns the array of data to be added to iterable, wrapped in a Promise
   * @param model
   * @returns {RSVP.Promise}
   */
  populateIterable: function (model) {
    var chunkSize = this.get('chunkSize'),
      iterableLength = this.get('iterable.length'),
      newData = model.slice(iterableLength, iterableLength + chunkSize);

    var promise = new Ember.RSVP.Promise(function (resolve) {
      Ember.run(null, resolve, newData);
    });

    return promise;
  },

  /**
   * Return true if there are still more items to add to iterable
   * When false ember-infinite-scroll will no longer try to add more items to iterable
   */
  hasMore: function () {
    return this.get('iterable.length') !== this.get('model.length');
  }.property('iterable.[]', 'model.[]'),

  actions: {
    fetchMore: function (callback) {
      var model = this.get('model');
      var promise = this.populateIterable(model);
      callback(promise);
    }
  }
});
