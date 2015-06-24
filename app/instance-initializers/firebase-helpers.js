/**
 * User: sirzach
 * Date: 6/23/15
 * Time: 8:18 PM
 */

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

  initialize: function(instance) {
    var store = instance.container.lookup('store:main');
    store.refFor = refFor;
  }
};
