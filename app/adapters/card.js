import DS from 'ember-data';
import config from 'webatrice/config/environment';

const { RESTAdapter } = DS;
let host;

if (config.environment === 'production' || config.environment === 'review-app') {
  host = 'https://big-furry-monster.herokuapp.com';
} else {
  host = 'http://localhost:3000';
}

export default RESTAdapter.extend({
  host
});
