export function initialize() {
  /**
   * Extend Array.prototype with a method that mutates the array order randomly.
   */
  Array.prototype.shuffle = function shuffle() {
    var index = this.length, temp, random;
    // While there are elements in the array.
    while (index > 0) {
      // Pick a random index.
      random = Math.floor(Math.random() * index);
      // Decrease index by 1.
      index--;
      // And swap the last element with it.
      temp = this[index];
      this[index] = this[random];
      this[random] = temp;
    }
    return this;
  };
}

export default {
  name: 'shuffle',
  initialize: initialize
};
