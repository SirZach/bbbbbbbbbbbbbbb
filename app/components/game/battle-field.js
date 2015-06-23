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

      return card.get('mainType') !== 'Land';
    });
  }),

  /** @property {Array<DS.GameCard>} land cards */
  landCards: Ember.computed('gameCards.[]', 'cards.[]', function () {
    return this.get('gameCards').filter(gameCard => {
      var card = this.get('cards').findBy('id', gameCard.get('cardId'));

      return card.get('mainType') === 'Land';
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

  /** @property {DS.GameParticipant} */
  player: null,

  /** @property {Boolean} a card is being dragged on the screen */
  cardIsDragging: false,

  /** @property {Boolean} this game-zone is currently the drop target */
  isDraggedOver: false,

  /** @property {Array<DS.Card>} DS.Cards between the decks in play */
  cards: [],

  /** @property {Boolean} can you drop a card onto this battlefield */
  canDrop: false,

  classNameBindings: ['cardIsDragging:show-drop', 'isDraggedOver'],

  drop: function (event) {
    if (this.get('canDrop')) {
      event.preventDefault();
      var dragData = JSON.parse(event.dataTransfer.getData('text/plain'));

      this.sendAction('droppedOn', dragData, this.get('player'), GameCard.BATTLEFIELD);

      //For some reason when this guy handles the drop, the dragEnd event is not fired. Le sigh.
      this.sendAction('dragEnded');
    }
  },

  dragOver: function (event) {
    if (this.get('canDrop')) {
      event.preventDefault();
      this.set('isDraggedOver', true);
    }
  },

  dragEnter: function (event) {
    if (this.get('canDrop')) {
      event.preventDefault();
      this.set('isDraggedOver', true);
    }
  },

  dragLeave: function (event) {
    if (this.get('canDrop')) {
      event.preventDefault();
      this.set('isDraggedOver', false);
    }
  },

  actions: {
    dragStarted: function () {
      this.sendAction('dragStarted');
    },

    dragEnded: function () {
      this.sendAction('dragEnded');
    }
  }
});
