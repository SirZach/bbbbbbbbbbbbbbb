import {
  moduleFor,
  test
} from 'ember-qunit';

moduleFor('controller:decks/list', {
  // Specify the other units that are required for this test.
  needs: ['controller:decks']
});

// Replace this with your real tests.
test('it exists', function(assert) {
  let controller = this.subject();
  assert.ok(controller);
});
