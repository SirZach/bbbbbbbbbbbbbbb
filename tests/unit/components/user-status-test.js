import {
  moduleForComponent,
  test
} from 'ember-qunit';
import Ember from 'ember';

moduleForComponent('user-status', {
  // specify the other units that are required for this test
  needs: [
    'component:paper-item',
    'component:paper-divider',
    'helper:from-now'
  ]
});

test('it renders', function(assert) {
  assert.expect(2);

  // creates the component instance
  let component = this.subject();
  assert.equal(component._state, 'preRender');

  // renders the component to the page
  this.render();
  assert.equal(component._state, 'inDOM');
});

test('statusClass - appends state to "user-"', function(assert) {
  assert.expect(1);

  let component = this.subject();
  Ember.run(function() {
    component.set('presence', {
      state: 'literally-cant-even'
    });
  });

  assert.equal(component.get('statusClass'), 'user-literally-cant-even');
});

test('isOnline - should parallel online state', function(assert) {
  assert.expect(3);
  let component = this.subject();
  Ember.run(function() {
    component.set('presence', {
      state: 'online'
    });
  });
  assert.ok(component.get('isOnline'));

  Ember.run(function() {
    component.set('presence.state', 'idle');
  });
  assert.ok(!component.get('isOnline'));

  Ember.run(function() {
    component.set('presence.state', 'offline');
  });
  assert.ok(!component.get('isOnline'));
});

test('isOffline - should parallel offline state', function(assert) {
  assert.expect(3);
  let component = this.subject();
  Ember.run(function() {
    component.set('presence', {
      state: 'offline'
    });
  });
  assert.ok(component.get('isOffline'));

  Ember.run(function() {
    component.set('presence.state', 'idle');
  });
  assert.ok(!component.get('isOffline'));

  Ember.run(function() {
    component.set('presence.state', 'online');
  });
  assert.ok(!component.get('isOffline'));
});

test('lastSeenLabel - should be "online" when active', function(assert) {
  assert.expect(1);
  let component = this.subject();
  Ember.run(function() {
    component.set('presence', {
      state: 'online'
    });
  });
  assert.equal(component.get('lastSeenLabel'), 'online');
});

test('lastSeenLabel - should be "online" when active', function(assert) {
  assert.expect(1);
  let component = this.subject();
  Ember.run(function() {
    component.set('presence', {
      state: 'online'
    });
  });
  assert.equal(component.get('lastSeenLabel'), 'online');
});

test('lastSeenLabel - should be "idle for" when idle', function(assert) {
  assert.expect(1);
  let component = this.subject();
  Ember.run(function() {
    component.set('presence', {
      state: 'idle'
    });
  });
  assert.equal(component.get('lastSeenLabel'), 'idle for');
});

test('lastSeenLabel - should be "last seen" when offline', function(assert) {
  assert.expect(1);
  let component = this.subject();
  Ember.run(function() {
    component.set('presence', {
      state: 'offline'
    });
  });
  assert.equal(component.get('lastSeenLabel'), 'last seen');
});
