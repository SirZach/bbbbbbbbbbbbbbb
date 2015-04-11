import {
  moduleForComponent,
  test
} from 'ember-qunit';
import Ember from 'ember';

moduleForComponent('game-listing', {
  // specify the other units that are required for this test
  needs: [
    'component:paper-item',
    'component:paper-tile-left',
    'component:paper-tile-content',
    'component:paper-button',
    'component:game-listing-player'
  ]
});

test('it renders', function (assert) {
  assert.expect(2);

  // creates the component instance
  var component = this.subject();
  var game = Ember.Object.create({
    gameParticipants: []
  });
  Ember.run(function () {
    component.set('game', game);
  });
  assert.equal(component._state, 'preRender');

  // renders the component to the page
  this.render();
  assert.equal(component._state, 'inDOM');
});

test('the players list contains the people playing', function (assert) {
  assert.expect(2);

  var component = this.subject();
  var game = Ember.Object.create({
    gameParticipants: [
      Ember.Object.create({
        isPlaying: true,
        user: {
          username: 'SirZach'
        }
      }),
      Ember.Object.create({
        isPlaying: true,
        user: {
          username: 'ahaurw01'
        }
      })
    ]
  });
  Ember.run(() => component.set('game', game));
  var players = component.get('players');
  assert.equal(players.length, 2);
  var names = players.mapBy('user.username');
  assert.deepEqual(names, ['SirZach', 'ahaurw01']);
});

test('the players list should be padded with a placeholder', function (assert) {
  assert.expect(2);

  var component = this.subject();
  var game = Ember.Object.create({
    gameParticipants: [
      Ember.Object.create({
        isPlaying: true,
        user: {
          username: 'SirZach'
        }
      })
    ]
  });
  Ember.run(() => component.set('game', game));
  var players = component.get('players');
  assert.equal(players.length, 2);
  var names = players.mapBy('user.username');
  assert.deepEqual(names, ['SirZach', '???']);
});

test('playerOne should be the first player', function (assert) {
  assert.expect(1);

  var component = this.subject();
  var game = Ember.Object.create({
    gameParticipants: [
      Ember.Object.create({
        isPlaying: true,
        user: {
          username: 'SirZach'
        }
      }),
      Ember.Object.create({
        isPlaying: true,
        user: {
          username: 'ahaurw01'
        }
      })
    ]
  });
  Ember.run(() => component.set('game', game));
  var playerOne = component.get('playerOne');
  assert.equal(playerOne.get('user.username'), 'SirZach');
});

test('playerTwo should be the second player', function (assert) {
  assert.expect(1);

  var component = this.subject();
  var game = Ember.Object.create({
    gameParticipants: [
      Ember.Object.create({
        isPlaying: true,
        user: {
          username: 'SirZach'
        }
      }),
      Ember.Object.create({
        isPlaying: true,
        user: {
          username: 'ahaurw01'
        }
      })
    ]
  });
  Ember.run(() => component.set('game', game));
  var playerTwo = component.get('playerTwo');
  assert.equal(playerTwo.get('user.username'), 'ahaurw01');
});

test('watchers should contain all people not playing', function (assert) {
  assert.expect(2);

  var component = this.subject();
  var game = Ember.Object.create({
    gameParticipants: [
      Ember.Object.create({
        isPlaying: true,
        user: {
          username: 'SirZach'
        }
      }),
      Ember.Object.create({
        isPlaying: true,
        user: {
          username: 'ahaurw01'
        }
      }),
      Ember.Object.create({
        isPlaying: false,
        user: {
          username: 'thomasjmwb'
        }
      }),
      Ember.Object.create({
        isPlaying: false,
        user: {
          username: 'wycats'
        }
      }),
      Ember.Object.create({
        isPlaying: false,
        user: {
          username: 'tomdale'
        }
      })
    ]
  });
  Ember.run(() => component.set('game', game));
  var watchers = component.get('watchers');
  assert.equal(watchers.length, 3);
  assert.deepEqual(watchers.mapBy('user.username'),
    ['thomasjmwb', 'wycats', 'tomdale']);
});
