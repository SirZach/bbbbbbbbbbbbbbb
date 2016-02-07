import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('deck-tile', 'Integration | Component | deck tile', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });" + EOL + EOL +

  this.render(hbs`{{deck-tile}}`);

  assert.equal(this.$().text().trim(), 'by');

  // Template block usage:" + EOL +
  this.render(hbs`
    {{#deck-tile}}
      template block text
    {{/deck-tile}}
  `);

  assert.equal(this.$().text().trim(), 'by');
});
