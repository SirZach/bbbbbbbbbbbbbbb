import Ember from 'ember';

export default Ember.Controller.extend({
  saveParams: function () {
    return [this.get('model')];
  }.property('model'),

  exportParams: function () {
    return ['deck/export-modal', this.get('model')];
  }.property('model'),

  canEdit: Ember.computed('model.owner.id', 'session.user.id', function () {
    let myId = this.get('session.user.id');
    let ownerId = this.get('model.owner.id');

    return myId === ownerId;
  })
});
