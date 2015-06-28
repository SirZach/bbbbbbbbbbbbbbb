import Ember from 'ember';
import layout from '../../templates/components/game/battle-field';
import GameCard from '../../models/game-card';

export default Ember.Component.extend({
  layout: layout,

  tagName: 'battle-field',

  /** @property {Array<DS.Model GameCard>} */
  gameCards: [],

  /** @property {Array<DS.GameCard>} non-land cards */
  nonLandCards: Ember.computed('gameCards.[]', 'cards.[]', function () {
    return this.get('gameCards').filter(gameCard => {
      var card = this.get('cards').findBy('id', gameCard.get('cardId'));

      return !card || card.get('mainType') !== 'Land';
    }).sort((gameCardA, gameCardB) => {
      var cardA = this.get('cards').findBy('id', gameCardA.get('cardId'));
      var cardB = this.get('cards').findBy('id', gameCardB.get('cardId'));
      var cardAType = cardA ? cardA.get('mainType') : 'Token';
      var cardBType = cardB ? cardB.get('mainType') : 'Token';

      if (cardAType > cardBType) {
        return 1;
      } else if (cardAType < cardBType) {
        return -1;
      } else {
        return 0;
      }
    });
  }),

  /** @property {Array<DS.GameCard>} land cards */
  landCards: Ember.computed('gameCards.[]', 'cards.[]', function () {
    return this.get('gameCards').filter(gameCard => {
      var card = this.get('cards').findBy('id', gameCard.get('cardId'));

      return card && card.get('mainType') === 'Land';
    });
  }),

  /** @property {Array<DS.GameCard>} cards to be rendered at the top of the battlefield */
  topCards: Ember.computed('bottomBattlefield', 'landCards.[]', 'nonLandCards.[]', function () {
    if (this.get('bottomBattlefield')) {
      return this.get('nonLandCards');
    } else {
      return this.get('landCards');
    }
  }),

  /** @property {Array<DS.GameCard>} cards to be rendered at the bottom of the battlefield */
  bottomCards: Ember.computed('bottomBattlefield', 'landCards.[]', 'nonLandCards.[]', function () {
    if (this.get('bottomBattlefield')) {
      return this.get('landCards');
    } else {
      return this.get('nonLandCards');
    }
  }),

  /** @property {Boolean} location of the battlefield */
  bottomBattlefield: true,

  /** @property {Boolean} ownership of the battlefield */
  readOnly: true,

  /** @property {DS.GameParticipant} */
  player: null,

  /** @property {Boolean} a card is being dragged on the screen */
  cardIsDragging: false,

  /** @property {Boolean} this game-zone is currently the drop target */
  isDraggedOver: false,

  /** @property {Array<DS.Card>} DS.Cards between the decks in play */
  cards: [],

  classNameBindings: ['cardIsDragging:show-drop', 'isDraggedOver'],

  drop: function (event) {
    if (!this.get('readOnly')) {
      event.preventDefault();
      var dragData = JSON.parse(event.dataTransfer.getData('text/plain'));

      this.set('isDraggedOver', false);
      this.sendAction('droppedOn', dragData, this.get('player'), GameCard.BATTLEFIELD);

      //For some reason when this guy handles the drop, the dragEnd event is not fired. Le sigh.
      this.sendAction('dragEnded');
    }
  },

  dragOver: function (event) {
    if (!this.get('readOnly')) {
      event.preventDefault();
      this.set('isDraggedOver', true);
    }
  },

  dragEnter: function (event) {
    if (!this.get('readOnly')) {
      event.preventDefault();
      this.set('isDraggedOver', true);
    }
  },

  dragLeave: function (event) {
    if (!this.get('readOnly')) {
      event.preventDefault();
      this.set('isDraggedOver', false);
    }
  },

  actions: {
    dragStarted: function () {
      if (!this.get('readOnly')) {
        this.sendAction('dragStarted');
      }
    },

    dragEnded: function () {
      if (!this.get('readOnly')) {
        this.sendAction('dragEnded');
      }
    },

    tap: function (gameCard) {
      if (!this.get('readOnly')) {
        this.sendAction('tap', gameCard);
      }
    }
  }
});
