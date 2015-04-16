import {
  moduleFor,
  test
} from 'ember-qunit';

moduleFor('controller:chat/channel', {
  // Specify the other units that are required for this test.
  // needs: ['controller:foo']
});

test('you can participate if you are logged in', function (assert) {
  var controller = this.subject();
  controller.set('session', {
    isAuthenticated: false
  });
  assert.equal(controller.get('canParticipate'), false);
});

test('you cannot participate if you are not logged in', function (assert) {
  var controller = this.subject();
  controller.set('session', {
    isAuthenticated: true
  });
  assert.equal(controller.get('canParticipate'), true);
});
