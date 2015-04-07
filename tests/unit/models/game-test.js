import {
  moduleForModel,
  test
} from 'ember-qunit';

moduleForModel('game', {
  // Specify the other units that are required for this test.
  needs: ['model:user', 'model:presence']
});

test('it exists', function(assert) {
  var model = this.subject();
  // var store = this.store();
  assert.ok(!!model);
});
