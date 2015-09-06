import Ember from 'ember';

export default Ember.Route.extend({
  actions: {
    loginWithSocial: function (provider) {
      this.get('session').loginWithSocial(provider).then(() => {
        this.transitionTo('/');
      });
    },

    logout: function () {
      this.get('session').logout();
      this.transitionTo('/');
      this.set('controller.drawerOpen', false);
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
    },

    createNewDeck: function () {
      this.transitionTo('deck.build', 'new');
    },

    /**
     * @param says - message to send in the chat
     * @param channel - what chat room should this message go in?
     * This action handles all chat rooms
     */
    say: function (says, channel, controller) {
      if (says.trim().length === 0) {
        return;
      }

      this.controllerFor(controller).set('says');

      var name = this.get('session.user.username');
      var avatarUrl = this.get('session.user.avatarUrl');
      var when = new Date();
      var chat = this.store.createRecord('chat', {
        name: name,
        avatarUrl: avatarUrl,
        says: says,
        when: when.getTime(),
        channel: channel
      });
      chat.save();
    },

    goToGame(game) {
      this.transitionTo('game', game);
    }
  }
});
