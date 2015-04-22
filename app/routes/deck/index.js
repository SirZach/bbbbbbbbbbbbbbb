import Ember from 'ember';

export default Ember.Route.extend({
  renderTemplate: function () {
    this._super.apply(this, arguments);

    this.render('nav-toolbars/deck-index', {
      into: 'application',
      outlet: 'nav-toolbar',
    });
  }
});
