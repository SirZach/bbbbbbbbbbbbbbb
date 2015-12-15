import Ember from 'ember';
import { moduleFor, test } from 'ember-qunit';

moduleFor('controller:deck/build');

test('defaultImageUrl is from the most expensive card', function(assert) {
  let controller = this.subject({
    model: Ember.Object.create({
      mainCardGroups: [{
        card: {
          cmc: 2,
          imageUrl: '/Titanic%20Growth'
        }
      }, {
        card: {
          cmc: 1,
          imageUrl: '/Giant%20Growth'
        }
      }]
    })
  });

  let result = controller.get('defaultImageUrl');

  assert.equal(result, '/Titanic%20Growth');
});

test('defaultImageUrl is default if no cards', function(assert) {
  let controller = this.subject();

  let result = controller.get('defaultImageUrl');

  assert.equal(result,
    'http://big-furry-monster.herokuapp.com/images/default');
});
