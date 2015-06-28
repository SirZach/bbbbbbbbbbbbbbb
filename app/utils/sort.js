export default {
  CardTypes: function (cards, gameCardA, gameCardB) {
    var cardA = cards.findBy('id', gameCardA.get('cardId'));
    var cardB = cards.findBy('id', gameCardB.get('cardId'));
    var cardAType = cardA ? cardA.get('mainType') : 'Token';
    var cardBType = cardB ? cardB.get('mainType') : 'Token';

    if (cardAType > cardBType) {
      return 1;
    } else if (cardAType < cardBType) {
      return -1;
    } else {
      return 0;
    }
  }
};
