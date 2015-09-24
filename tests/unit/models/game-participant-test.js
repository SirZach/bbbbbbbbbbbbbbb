import {
  moduleForModel,
  test
} from 'ember-qunit';
import Ember from 'ember';
import GameCard from 'webatrice/models/game-card';

moduleForModel('game-participant', {
  // Specify the other units that are required for this test.
  needs: [
    'model:gameCard',
    'model:user',
    'model:presence',
    'model:card',
    'model:deck'
  ]
});

let gameCardFixtures = [{
  id: 1,
  cardId: 'Swamp',
  order: 1
}, {
  id: 2,
  cardId: 'Swamp',
  order: 2
}, {
  id: 3,
  cardId: 'Island',
  order: 3
}, {
  id: 4,
  cardId: 'Island',
  order: 4
}];

test('it exists', function(assert) {
  let model = this.subject();
  // var store = this.store();
  assert.ok(!!model);
});

test('gameCards - sets raw', function(assert) {
  assert.expect(5);
  let model = this.subject();
  Ember.run(function () {
    let gameCards = gameCardFixtures.map(fixture => GameCard.create(fixture));
    model.set('gameCards', gameCards);
  });
  let gameCardsRaw = model.get('gameCardsRaw');
  assert.equal(typeof gameCardsRaw, 'string');
  let gameCardsRawHydrated = JSON.parse(gameCardsRaw);
  assert.equal(gameCardsRawHydrated.length, 4);
  assert.equal(gameCardsRawHydrated[3].id, 4);
  assert.equal(gameCardsRawHydrated[3].cardId, 'Island');
  assert.equal(gameCardsRawHydrated[3].order, 4);
});

test('gameCards - update raw', function(assert) {
  let model = this.subject();
  let gameCards;
  Ember.run(function () {
    gameCards = gameCardFixtures.map(fixture => GameCard.create(fixture));
    model.set('gameCards', gameCards);
  });
  let gameCardFixturesNew = [];
  gameCardFixturesNew.pushObjects(gameCardFixtures);
  gameCardFixturesNew.push({
    id: 5,
    isToken: true,
    tokenStats: {
      name: 'Spirit',
      power: 1,
      toughness: 1,
      description: 'Flying'
    },
    zone: 'battlefield'
  });
  let newGameCardsRaw = JSON.stringify(gameCardFixturesNew);
  Ember.run(function () {
    model.set('gameCardsRaw', newGameCardsRaw);
  });
  gameCards = model.get('gameCards');
  assert.equal(gameCards.get('length'), 5);
  let token = gameCards.findBy('isToken', true);
  assert.ok(token);
  assert.equal(token.tokenStats.name, 'Spirit');
  assert.equal(token.zone, 'battlefield');
});
