import {
  moduleForModel,
  test
} from 'ember-qunit';

moduleForModel('card-group', {
  // Specify the other units that are required for this test.
  needs: ['model:card']
});

test('it exists', function(assert) {
  let model = this.subject();
  // var store = this.store();
  assert.ok(!!model);
});
