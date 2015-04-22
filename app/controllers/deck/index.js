import Ember from 'ember';

export default Ember.Controller.extend({
  canEdit: function () {
    var myId = this.get('session.user.id');
    var ownerId = this.get('model.owner.id');
    return myId === ownerId;
  }.property('model.owner.id', 'session.user.id')
});
