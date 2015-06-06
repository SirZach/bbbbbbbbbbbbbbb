import DS from 'ember-data';

/**
 * Get the firebase ref for the given record of the given type.
 *
 * @param {String} type   E.g. 'presence'.
 * @param {Model} record  A model instance.
 */
function refFor(type, record) {
  var adapter = this.adapterFor(type);
  var modelType = this.modelFor(type);
  return adapter._getRef(modelType, record.get('id'));
}

export default {
  name: 'Firebase Helpers',

  initialize: function () {
    DS.Store.reopen({refFor});
  }
};
