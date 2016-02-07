import Ember from 'ember';
const { get, computed } = Ember;

export default Ember.Controller.extend({
  applicationController: Ember.inject.controller('application'),

  saveParams: function() {
    return [get(this, 'model')];
  }.property('model'),

  exportParams: function() {
    return ['deck/export-modal', get(this, 'model')];
  }.property('model'),

  canEdit: computed('model.owner.id', 'session.user.id', 'applicationController.currentRouteName', function() {
    let myId = get(this, 'session.user.id');
    let ownerId = get(this, 'model.owner.id');
    let currentRouteName = get(this, 'applicationController.currentRouteName');

    return myId === ownerId && currentRouteName !== 'deck.build';
  })
});
