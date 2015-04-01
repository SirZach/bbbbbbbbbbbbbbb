import Ember from 'ember';
import config from 'webatrice/config/environment';

var Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.route('login');
  this.resource('user', {path: '/u/:user_id'});
  this.resource('decks', function () {
    this.route('list');
    this.resource('deck', {path: '/:deck_id'}, function () {
      this.route('build');
    });
  });

  this.resource('cards', function () {
    this.resource('card', {path: '/:cardName'});
  });

  this.resource('chat', function () {
    this.resource('chat.channel', {path: '/:channel'});
  });
});

export default Router;
