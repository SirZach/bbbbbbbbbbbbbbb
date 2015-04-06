import Ember from 'ember';

export default Ember.Route.extend({
  beforeModel: function () {
    var cardsController = this.controllerFor('cards');
    return this.store.find('card').then(function (cards) {
      cardsController.set('model', cards);
      return;
    });
  },

  actions: {
    loginWithGithub: function () {
      this.get('session').login().then(function (/* user */) {
      }, function (/* error */) {
      });
    },

    openModal: function (modalName, model) {
      return this.render(modalName, {
        controller: modalName,
        model: model ? model : Ember.Object.create({}),
        into: 'application',
        outlet: 'modal'
      });
    },

    closeModal: function () {
      return this.disconnectOutlet({
        outlet: 'modal',
        parentView: 'application'
      });
    }
  }
});
