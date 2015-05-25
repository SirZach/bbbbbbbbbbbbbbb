import Ember from 'ember';

export default Ember.Route.extend({
  beforeModel: function () {
    if (!this.get('session.isAuthenticated')) {
      this.replaceWith('/');
    }
  },

  model: function () {
    return this._createFetchPromise();
  },

  _createFetchPromise: function () {
    // Adding a space to the last deck id is a hack to tell firebase to start
    // AFTER the last id we saw.
    //
    var startAt = (this.get('_lastDeckId') || '') + ' ';
    var limitToFirst = 5;
    return this.store.find('deck', {
      startAt,
      limitToFirst
    }).then((decks) => {
      var model = this.currentModel || [];
      decks = decks.toArray();
      if (decks.length === 0 || decks.length < limitToFirst) {
        // Setting `reachedInfinity` on the model tells the infinity loader to
        // style itself propertly. It doesn't, however, stop it from firing load
        // events.
        //
        model.set('reachedInfinity', true);
      } else {
        // Stash the last id so we know where to start next.
        this.set('_lastDeckId', decks.get('lastObject.id'));
      }
      model.pushObjects(decks);
      return model;
    });
  },

  actions: {
    deleteDeck: function (deck) {
      deck.destroyRecord()
        .then(() => {
          this.notifications.addNotification({
            message: 'Deleted',
            type: 'success',
            autoClear: true,
            clearDuration: 1200
          });
        })
        .catch(() => {
          this.notifications.addNotification({
            message: 'Error',
            type: 'error'
          });
        });
    },

    goToDeck: function (deck) {
      this.transitionTo('deck.index', deck);
    },

    goToDeckBuilder: function (deck) {
      this.transitionTo('deck.build', deck);
    },

    importDeck: function () {
      this.send('openModal', 'decks/import-deck');
    },

    infinityLoad: function () {
      var model = this.currentModel;
      if (this.get('_isLoading') || model.get('reachedInfinity')) {
        return;
      }
      this.set('_isLoading', true);
      this._createFetchPromise().then(() => this.set('_isLoading', false));
    }
  }
});
