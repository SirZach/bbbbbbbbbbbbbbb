import Ember from 'ember';

export default Ember.Controller.extend({
  saveParams: function () {
    return [this.get('model')];
  }.property('model'),

  exportParams: function () {
    return ['deck/export-modal', this.get('model')];
  }.property('model')
});
