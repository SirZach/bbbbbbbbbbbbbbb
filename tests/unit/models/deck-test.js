import {
  moduleForModel,
  test
} from 'ember-qunit';

moduleForModel('deck', {
  // Specify the other units that are required for this test.
  needs: ['model:card', 'model:user', 'model:presence', 'model:cardGroup']
});

// Replace this with your real tests.
test('it exists', function(assert) {
  var model = this.subject();
  // var store = this.store();
  assert.ok(!!model);
});
