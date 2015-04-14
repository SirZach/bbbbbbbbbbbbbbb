import {
  moduleFor,
  test
} from 'ember-qunit';

moduleFor('controller:games/list', {
  // Specify the other units that are required for this test.
  // needs: ['controller:foo']
});

test('canCreateGame - anon user', function(assert) {
  var controller = this.subject();
  controller.set('session', {
    user: {isAnonymous: true}
  });
  assert.equal(controller.get('canCreateGame'), false);
});

test('canCreateGame - decks not ready', function(assert) {
  var controller = this.subject();
  controller.set('session', {
    user: {
      isAnonymous: false,
      hasGameReadyDecks: false
    }
  });
  assert.equal(controller.get('canCreateGame'), false);
});

test('canCreateGame - all good', function(assert) {
  var controller = this.subject();
  controller.set('session', {
    user: {
      isAnonymous: false,
      hasGameReadyDecks: true
    }
  });
  assert.equal(controller.get('canCreateGame'), true);
});
