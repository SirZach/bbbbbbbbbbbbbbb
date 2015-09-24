export default {
  CardTypes: function(cards, gameCardA, gameCardB) {
    let cardA = cards.findBy('id', gameCardA.get('cardId'));
    let cardB = cards.findBy('id', gameCardB.get('cardId'));
    let cardAType = cardA ? cardA.get('mainType') : 'Token';
    let cardBType = cardB ? cardB.get('mainType') : 'Token';

    if (cardAType > cardBType) {
      return 1;
    } else if (cardAType < cardBType) {
      return -1;
    } else {
      return 0;
    }
  }
};
