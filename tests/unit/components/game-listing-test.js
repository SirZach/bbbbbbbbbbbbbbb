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