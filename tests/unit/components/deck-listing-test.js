import {
  moduleForComponent,
  test
} from 'ember-qunit';

moduleForComponent('deck-listing', {
  // specify the other units that are required for this test
  needs: [
    'component:paper-icon',
    'component:x-paper-button-delayed',
    'component:x-paper-button',
    'component:titled-card',
    'component:mana-curve-chart',
    'component:card-breakdown-chart',
    'component:paper-button'
  ]
});

test('it renders', function(assert) {
  assert.expect(2);

  // creates the component instance
  var component = this.subject();
  assert.equal(component._state, 'preRender');

  // renders the component to the page
  this.render();
  assert.equal(component._state, 'inDOM');
});
