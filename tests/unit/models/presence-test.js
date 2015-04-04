import {
  moduleForModel,
  test
} from 'ember-qunit';
import Ember from 'ember';

moduleForModel('presence', {
  // Specify the other units that are required for this test.
  needs: ['model:user']
});

test('it exists', function (assert) {
  var model = this.subject();
  // var store = this.store();
  assert.ok(!!model);
});

test('statePriority - maps state to an integer (online)', function (assert) {
  var model = this.subject({
    state: 'online'
  });
  assert.equal(model.get('statePriority'), 1);
});

test('statePriority - maps state to an integer (idle)', function (assert) {
  var model = this.subject({
    state: 'idle'
  });
  assert.equal(model.get('statePriority'), 2);
});

test('statePriority - maps state to an integer (offline)', function (assert) {
  var model = this.subject({
    state: 'offline'
  });
  assert.equal(model.get('statePriority'), 3);
});

test('statePriority - maps state to an integer (default)', function (assert) {
  var model = this.subject();
  assert.equal(model.get('statePriority'), 99);
});

test('statePriority - order should make sense', function (assert) {
  assert.expect(3);

  var model = this.subject({
    state: 'online'
  });
  var priorities = [];
  priorities.push(model.get('statePriority'));

  Ember.run(function () {
    model.set('state', 'idle');
  });
  priorities.push(model.get('statePriority'));

  Ember.run(function () {
    model.set('state', 'offline');
  });
  priorities.push(model.get('statePriority'));

  Ember.run(function () {
    model.set('state');
  });
  priorities.push(model.get('statePriority'));

  priorities.forEach(function (priority, index) {
    if (index + 1 < priorities.length) {
      assert.ok(priority < priorities[index + 1]);
    }
  });
});
