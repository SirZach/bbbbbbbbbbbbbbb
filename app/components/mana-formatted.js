import Ember from 'ember';

function getSymbol(letter) {
  if (letter === 'U') {
    return {
      symbol: '+',
      description: 'Island'
    };
  } else if (letter === 'B') {
    return {
      symbol: '=',
      description: 'Swamp'
    };
  } else if (letter === 'R') {
    return {
      symbol: '<',
      description: 'Mountain'
    };
  } else if (letter === 'G') {
    return {
      symbol: '>',
      description: 'Forest'
    };
  } else if (letter === 'W') {
    return {
      symbol: '@',
      description: 'Plains'
    };
  } else if (!isNaN(letter)) {
    return {
      isNumber: true,
      value: letter
    };
  } else {
    return {
      noSymbol: true,
      value: letter
    };
  }
}

export default Ember.Component.extend({
  tagName: 'span',

  formattedCharacters: function() {
    let mana = this.get('mana');
    let charObjects = [];

    for (let i = 0; i < mana.length; i++) {
      let char = mana.charAt(i);
      charObjects.pushObject(getSymbol(char));
    }

    return charObjects;
  }.property('mana')
});
