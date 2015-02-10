import Ember from 'ember';

export default Ember.Route.extend({
  model: function (params) {
    return this.controllerFor('cards')
      .get('model')
      .find(function (c) {
        return c.get('name').toLowerCase() === params.cardName.toLowerCase();
      });
  }
});
