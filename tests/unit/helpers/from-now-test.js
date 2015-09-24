import {
  fromNow
} from '../../../helpers/from-now';
import { module, test } from 'qunit';

module('FromNowHelper');

test('it renders a time with suffix', function(assert) {
  let date = moment().subtract(1, 'days').toDate();
  let result = fromNow([date], {includeSuffix: true});
  assert.equal(result, 'a day ago');
});

test('it renders a time without suffix', function(assert) {
  let date = moment().subtract(1, 'days').toDate();
  let result = fromNow([date], {includeSuffix: false});
  assert.equal(result, 'a day');
});

test('it does not render a suffix by default', function(assert) {
  let date = moment().subtract(1, 'days').toDate();
  let result = fromNow([date]);
  assert.equal(result, 'a day');
});
