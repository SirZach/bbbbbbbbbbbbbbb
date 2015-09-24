import {
  moduleForComponent,
  test
} from 'ember-qunit';

moduleForComponent('failed-imports', {
  // specify the other units that are required for this test
  needs: [
    'component:paper-button',
    'component:paper-content',
    'component:paper-list',
    'component:paper-item'
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
