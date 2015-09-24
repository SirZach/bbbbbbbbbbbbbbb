import {
  moduleForComponent,
  test
} from 'ember-qunit';

moduleForComponent('game/battle-field', 'Unit | Component | game/battle field', {
  // specify the other units that are required for this test
  // needs: ['component:foo', 'helper:bar']
});

test('it renders', function(assert) {
  assert.expect(2);

  // creates the component instance
  let component = this.subject({
    nonLandCards: []//this computed property breaks during CL tests but not browser tests :(
  });
  assert.equal(component._state, 'preRender');

  // renders the component to the page
  this.render();
  assert.equal(component._state, 'inDOM');
});
