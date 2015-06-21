import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['game-left-column'],
  classNameBindings: ['isOpen'],

  /** @property {Boolean} is the column open */
  isOpen: false,

  /** @property {DS.GameParticipant} */
  player: null,

  /** @property {String} */
  zone: null,

  /** @property {Array<DS.GameCard>} */
  gameCards: null,

  /** @property {Array<DS.Card>} */
  cardsInDecks: null,

  actions: {
    close: function () {
      this.sendAction('close');
    }
  }
});
