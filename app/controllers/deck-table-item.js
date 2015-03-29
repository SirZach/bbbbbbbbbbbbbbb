import Ember from 'ember';

export default Ember.Controller.extend({
  needs: ['deck/build'],

  /** @property {Boolean} - can this deck grouping be shown? */
  canShow: function () {
    var superType = this.get('model.superType'),
        doNotShowTypes = this.get('controllers.deck/build.doNotShowTypes');

    return !doNotShowTypes.contains(superType);
  }.property('controllers.deck/build.doNotShowTypes.@each', 'model')
});
