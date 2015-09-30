import {
  moduleForComponent,
  test
} from 'ember-qunit';
import Ember from 'ember';

moduleForComponent('sample-draw-chart', {
  // specify the other units that are required for this test
  needs: [
    'component:paper-card-content',
    'component:paper-icon',
    'component:x-paper-button'
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

let deckFixture = Ember.Object.create({
  mainCardGroups: [
    Ember.Object.create({
      count: 1,
      card: Ember.Object.create({
        name: 'Chalice of Life',
        cmc: 3
      })
    }),
    Ember.Object.create({
      count: 1,
      card: Ember.Object.create({
        name: 'Guttersnipe',
        cmc: 3
      })
    }),
    Ember.Object.create({
      count: 1,
      card: Ember.Object.create({
        name: 'Ajani\'s Pridemate',
        cmc: 2
      })
    }),
    Ember.Object.create({
      count: 1,
      card: Ember.Object.create({
        name: 'Lightning Strike',
        cmc: 2
      })
    }),
    Ember.Object.create({
      count: 1,
      card: Ember.Object.create({
        name: 'Soul Warden',
        cmc: 1
      })
    }),
    Ember.Object.create({
      count: 1,
      card: Ember.Object.create({
        name: 'Lightning Bolt',
        cmc: 1
      })
    }),
    Ember.Object.create({
      count: 1,
      card: Ember.Object.create({
        name: 'Plains',
        cmc: 0
      })
    }),
    Ember.Object.create({
      count: 1,
      card: Ember.Object.create({
        name: 'Mountain',
        cmc: 0
      })
    })
  ]
});

test('hand has 7 cards', function(assert) {
  let component = this.subject({
    deck: deckFixture
  });
  component.send('refresh');
  let hand = component.get('hand');
  assert.equal(hand.length, 7);
});

test('sorted hand is sorted by name and cmc', function(assert) {
  assert.expect(15);
  let component = this.subject({
    deck: deckFixture
  });
  component.send('refresh');
  let hand = component.get('sortedHand');
  assert.equal(hand.length, 7);
  let previousCmc = -1;
  let previousName = '';
  hand.forEach((card) => {
    assert.ok(card.get('cmc') >= previousCmc);
    if (previousCmc !== card.get('cmc')) {
      previousName = '';
    }
    assert.ok(card.get('name') >= previousName);
    previousCmc = card.get('cmc');
    previousName = card.get('name');
  });
});
