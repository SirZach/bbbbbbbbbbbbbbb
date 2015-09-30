import { moduleForModel, test } from 'ember-qunit';

moduleForModel('deck', 'Unit | Serializer | deck', {
  // Specify the other units that are required for this test.
  needs: ['serializer:deck', 'model:card-group', 'model:user']
});

// Replace this with your real tests.
test('it serializes records', function(assert) {
  let record = this.subject();

  let serializedRecord = record.serialize();

  assert.ok(serializedRecord);
});
