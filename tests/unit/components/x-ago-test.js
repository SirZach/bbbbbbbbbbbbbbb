import {
  moduleForComponent,
  test
} from 'ember-qunit';
import Ember from 'ember';

moduleForComponent('x-ago', {
  // specify the other units that are required for this test
  needs: ['helper:from-x', 'component:paper-icon']
});

test('it renders', function(assert) {
  assert.expect(2);

  // creates the component instance
  let component = this.subject();
  Ember.run(function () {
    component.set('date', new Date());
  });
  assert.equal(component._state, 'preRender');

  // renders the component to the page
  this.render();
  assert.equal(component._state, 'inDOM');
});

test('it renders a time ago', function(assert) {
  assert.expect(1);

  let component = this.subject();
  Ember.run(function () {
    component.set('date', moment().subtract(1, 'days').toDate());
  });
  assert.equal(this.$().text().trim(), 'a day ago');
});
