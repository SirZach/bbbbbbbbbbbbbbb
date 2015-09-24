import {
  moduleForComponent,
  test
} from 'ember-qunit';

moduleForComponent('x-card', {
  // specify the other units that are required for this test
  needs: [
    'component:paper-card',
    'component:x-card-image',
    'component:paper-card-content',
    'component:mana-formatted',
    'component:promise-spinner',
    'service:promise-spinner-urls'
  ]
});

/*
test('it renders', function(assert) {
  assert.expect(2);

  // creates the component instance
  var component = this.subject();
  assert.equal(component._state, 'preRender');

  // renders the component to the page
  this.render();
  assert.equal(component._state, 'inDOM');
});
*/
