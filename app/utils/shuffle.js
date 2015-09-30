/**
 * A helper function that randomizes an array.
 *
 * @param {Array} The array to shuffle.
 *
 * @return {Array} That same array, shuffled.
 */
export default function shuffle(array) {
  let index = array.length;
  let temp;
  let random;
  // While there are elements in the array.
  while (index > 0) {
    // Pick a random index.
    random = Math.floor(Math.random() * index);
    // Decrease index by 1.
    index--;
    // And swap the last element with it.
    temp = array[index];
    array[index] = array[random];
    array[random] = temp;
  }
  return array;
}
