import Ember from 'ember';
import XPaperItem from './x-paper-item';
import layout from '../templates/components/deck-listing';

const { computed } = Ember;

export default XPaperItem.extend({
  layout,

  classNames: ['deck-header', 'md-3-line'],

  canEdit: computed('deck.owner.id', 'currentUser.id', function() {
    let ownerId = this.get('deck.owner.id') || 'owner';
    let myId = this.get('currentUser.id') || 'me';
    return ownerId === myId;
  }),

  actions: {
    goToDeck() {
      this.sendAction('goToDeck', this.get('deck'));
    },

    deleteDeck() {
      this.sendAction('deleteDeck', this.get('deck'));
    },

    goToDeckBuilder() {
      this.sendAction('goToDeckBuilder', this.get('deck'));
    }
  }
});
