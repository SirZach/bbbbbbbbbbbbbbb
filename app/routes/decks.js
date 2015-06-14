import Ember from 'ember';

export default Ember.Route.extend({
  queryParams: {
    mine: {
      refreshModel: true
    }
  },

  beforeModel: function () {
    if (!this.get('session.isAuthenticated')) {
      this.replaceWith('/');
    } else {
      // Wait for the user record to load.
      return this.get('session.user');
    }
  },

  model: function ({mine}) {
    if (mine) {
      return this.get('session.user.decks').then(decks => {
        // Show last created first.
        var model = decks.toArray().reverseObjects();
        // We don't want to lazy load any more models.
        model.set('loadsLazily', false);
        return model;
      });
    }

    // Load all decks, not just mine. Ensure we don't have old stuff cached.
    this.set('_lastDeckId');
    this.set('_unfilteredDecks');
    return this._createFetchPromise();
  },

  _createFetchPromise: function () {
    var lastDeckId = this.get('_lastDeckId');
    var endAt = lastDeckId ? lastDeckId : null;
    var model = this.get('_unfilteredDecks') || [];
    model.set('loadsLazily', true);

    // OMG what a hack. Firebase doesn't support exclusive queries, so ask for
    // one more than we want if we have already loaded some records.
    //
    var limitToLast = 10;
    var paddedLimitToLast = model.length ? limitToLast + 1 : limitToLast;
    return this.store.find('deck', {
      endAt,
      limitToLast: paddedLimitToLast
    }).then((decks) => {
      decks = decks.toArray().reverseObjects();
      // If we are doing this hack to fake an exclusive query, drop the last
      // record we loaded.
      //
      if (model.length) {
        decks.shift();
      }
      if (decks.length === 0 || decks.length < limitToLast) {
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
      this.set('_unfilteredDecks', model);
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
