import Ember from 'ember';

export default Ember.Route.extend({
  afterModel: function (deck) {
    return deck.get('owner').then((owner) => {
      if (owner.get('id') !== this.get('session.user.id')) {
        this.transitionTo('/');
      }
    });
  },

  renderTemplate: function () {
    this._super.apply(this, arguments);

    this.render('nav-toolbars/deck-build', {
      into: 'application',
      outlet: 'nav-toolbar'
    });
  }
});
