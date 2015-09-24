import {
  moduleForModel,
  test
} from 'ember-qunit';

moduleForModel('log-message', {
  // Specify the other units that are required for this test.
  needs: []
});

test('it exists', function(assert) {
  let model = this.subject();
  // var store = this.store();
  assert.ok(!!model);
});
