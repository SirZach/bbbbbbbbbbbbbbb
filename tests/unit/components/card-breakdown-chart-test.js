import {
  moduleForComponent,
  test
} from 'ember-qunit';
import Ember from 'ember';

moduleForComponent('card-breakdown-chart', {
  // specify the other units that are required for this test
  needs: ['component:az-graph', 'component:az-y', 'component:az-bars']
});

test('it renders', function(assert) {
  assert.expect(2);

  // creates the component instance
  let component = this.subject({
    deck: Ember.Object.create({
      cardGroups: []
    })
  });
  assert.equal(component._state, 'preRender');

  // renders the component to the page
  this.render();
  assert.equal(component._state, 'inDOM');
});
