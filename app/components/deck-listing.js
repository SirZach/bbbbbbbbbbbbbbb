import Ember from 'ember';
import XPaperItem from './x-paper-item';
import layout from '../templates/components/deck-listing';

export default XPaperItem.extend({
  layout: layout,

  canEdit: Ember.computed('deck.owner.id', 'currentUser.id', function () {
    var ownerId = this.get('deck.owner.id') || 'owner';
    var myId = this.get('currentUser.id') || 'me';
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
