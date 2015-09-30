import Ember from 'ember';

export default Ember.Route.extend({
  actions: {
    loginWithSocial(provider) {
      this.get('session').loginWithSocial(provider).then(() => {
        this.transitionTo('/');
      });
    },

    logout() {
      this.get('session').logout();
      this.transitionTo('/');
      this.set('controller.drawerOpen', false);
    },

    openModal(modalName, model) {
      return this.render(modalName, {
        controller: modalName,
        model: model ? model : Ember.Object.create({}),
        into: 'application',
        outlet: 'modal'
      });
    },

    closeModal() {
      return this.disconnectOutlet({
        outlet: 'modal',
        parentView: 'application'
      });
    },

    createNewDeck() {
      this.transitionTo('deck.build', 'new');
    },

    /**
     * @param says - message to send in the chat
     * @param channel - what chat room should this message go in?
     * This action handles all chat rooms
     */
    say(says, channel) {
      if (says.trim().length === 0) {
        return;
      }

      let name = this.get('session.user.username');
      let avatarUrl = this.get('session.user.avatarUrl');
      let when = new Date();
      let chat = this.store.createRecord('chat', {
        name,
        avatarUrl,
        says,
        when: when.getTime(),
        channel
      });
      chat.save();
    },

    goToGame(game) {
      this.transitionTo('game', game);
    }
  }
});
