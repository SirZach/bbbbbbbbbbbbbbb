import {
  moduleFor,
  test
} from 'ember-qunit';

moduleFor('controller:game', {
  // Specify the other units that are required for this test.
  // needs: ['controller:foo']
});

test('top title is waiting for player when no players', function (assert) {
  var controller = this.subject({
    model: {
      status: 'preparing',
      gameParticipants: []
    }
  });
  assert.equal(controller.get('topBoardTitle'), 'Waiting for player...');
});

test('bottom title is waiting for player when no players', function (assert) {
  var controller = this.subject({
    model: {
      status: 'preparing',
      gameParticipants: []
    }
  });
  assert.equal(controller.get('bottomBoardTitle'), 'Waiting for player...');
});

test('top title is waiting for so-and-so to choose when one other player', function (assert) {
  var controller = this.subject({
    model: {
      status: 'preparing',
      gameParticipants: [{
        user: {id: 'him', username: 'SirZach'},
        isPlaying: true
      }]
    }
  });
  assert.equal(controller.get('topBoardTitle'), 'Waiting for SirZach to choose a deck');
});

test('bottom title is choose a deck when you are preparing', function (assert) {
  var controller = this.subject({
    model: {
      status: 'preparing',
      gameParticipants: [{
        user: {id: 'me'},
        isPlaying: true
      }]
    },
    session: {
      user: {id: 'me'}
    }
  });
  assert.equal(controller.get('bottomBoardTitle'), 'Choose a deck');
});

test('top title is he\'s ready when ready', function (assert) {
  var controller = this.subject({
    model: {
      status: 'preparing',
      gameParticipants: [{
        user: {id: 'him', username: 'SirZach'},
        isPlaying: true,
        isReady: true
      }]
    }
  });
  assert.equal(controller.get('topBoardTitle'), 'SirZach is ready');
});

test('bottom title is he\s ready when ready', function (assert) {
  var controller = this.subject({
    model: {
      status: 'preparing',
      gameParticipants: [{
        user: {id: 'him', username: 'SirZach'},
        isPlaying: true,
        isReady: true
      }, {
        user: {id: 'other-him', username: 'thomasjmwb'},
        isPlaying: true
      }]
    }
  });
  assert.equal(controller.get('bottomBoardTitle'), 'SirZach is ready');
});

test('bottom title is you are ready when I\'m ready', function (assert) {
  var controller = this.subject({
    model: {
      status: 'preparing',
      gameParticipants: [{
        user: {id: 'me', username: 'ahaurw01'},
        isPlaying: true,
        isReady: true
      }]
    },
    session: {
      user: {id: 'me'}
    }
  });
  assert.equal(controller.get('bottomBoardTitle'), 'You are ready');
});
