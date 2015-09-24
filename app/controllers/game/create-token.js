import Ember from 'ember';

export default Ember.Controller.extend({
  player: null,

  game: null,

  name: null,

  power: null,

  toughness: null,

  description: null,

  actions: {
    close: function() {
      return this.send('closeModal');
    },

    createToken: function() {
      let gameCard = this.get('model');
      let player = this.get('player');
      let playerGameCards = player.get('gameCards');
      let game = this.get('game');

      gameCard.set('tokenStats', {
        name: this.get('name'),
        power: this.get('power'),
        toughness: this.get('toughness'),
        description: this.get('description')
      });

      playerGameCards.push(gameCard);
      player.set('gameCards', playerGameCards);

      game.save().then(() => this.send('close'));
    }
  }
});
