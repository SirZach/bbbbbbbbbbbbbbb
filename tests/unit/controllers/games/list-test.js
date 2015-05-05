import {
  moduleFor,
  test
} from 'ember-qunit';

moduleFor('controller:games/list', {
  // Specify the other units that are required for this test.
  // needs: ['controller:foo']
});

test('canCreateGame - no logged in user', function(assert) {
  var controller = this.subject();
  controller.set('session', {});
  assert.equal(controller.get('canCreateGame'), false);
});

test('canCreateGame - user is logged in', function(assert) {
  var controller = this.subject();
  controller.set('session', {
    user: {}
  });
  assert.equal(controller.get('canCreateGame'), true);
});
