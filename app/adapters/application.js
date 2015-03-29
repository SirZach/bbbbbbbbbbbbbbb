import DS from 'ember-data';
import ENV from 'webatrice/config/environment';
var host;

if (ENV.environment === 'production') {
  host = 'https://big-furry-monster.herokuapp.com';
} else {
  host = 'http://localhost:3000';
}

export default DS.RESTAdapter.extend({
  host: host
});
