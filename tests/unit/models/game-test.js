import {
  moduleForModel,
  test
} from 'ember-qunit';

moduleForModel('game', {
  // Specify the other units that are required for this test.
  needs: [
    'model:gameParticipant',
    'model:gameCard',
    'model:user',
    'model:presence',
    'model:card'
  ]
});

test('it exists', function(assert) {
  var model = this.subject();
  // var store = this.store();
  assert.ok(!!model);
});
