import Ember from 'ember';

export default Ember.Route.extend({
  renderTemplate: function () {
    this._super.apply(this, arguments);

    this.render('nav-toolbars/decks-list', {
      into: 'application',
      outlet: 'nav-toolbar',
    });
  }
});
