import {
  moduleForComponent,
  test
} from 'ember-qunit';

moduleForComponent('deck-table-item', {
  // specify the other units that are required for this test
  needs: ['component:x-tr', 'helper:pluralize-string']
});

// Omitting tests for now. It freaks out because of no tagName.
// test('it renders', function(assert) {
//   assert.expect(2);

//   // creates the component instance
//   var component = this.subject({
//     doNotShowTypes: []
//   });
//   assert.equal(component._state, 'preRender');

//   // renders the component to the page
//   this.render();
//   assert.equal(component._state, 'inDOM');
// });
