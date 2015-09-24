import ENV from 'webatrice/config/environment';
import DS from 'ember-data';

/* for ref: single card format

{"Air Elemental":
  {"layout":"normal",
  "name":"Air Elemental",
  "manaCost":"{3}{U}{U}",
  "cmc":5,
  "colors":["Blue"],
  "type":"Creature — Elemental",
  "types":["Creature"],
  "subtypes":["Elemental"],
  "text":"Flying",
  "power":"4",
  "toughness":"4","
  imageName":"air elemental",
  "foreignNames":[{"language":"Chinese Simplified","name":"大气元素"},
      {"language":"Chinese Traditional","name":"大氣元素"},
      {"language":"French","name":"Élémental d'air"},
      {"language":"German","name":"Luftelementar"},{
      "language":"Italian","name":"Elementale dell'Aria"},
      {"language":"Japanese","name":"大気の精霊"},
      {"language":"Korean","name":"공기의 정령"},
      {"language":"Portuguese (Brazil)","name":"Elemental do Ar"},
      {"language":"Russian","name":"Элементаль воздуха"},
      {"language":"Spanish","name":"Elemental de aire"}],
  "printings":["Limited Edition Alpha",
      "Limited Edition Beta","Unlimited Edition","Revised Edition",
      "Fourth Edition","Fifth Edition","Portal Second Age",
      "Classic Sixth Edition","Starter 1999","Battle Royale Box Set",
      "Beatdown Box Set","Seventh Edition","Eighth Edition",
      "Ninth Edition","Tenth Edition","Duel Decks: Jace vs. Chandra",
      "Magic 2010","Duels of the Planeswalkers","Masters Edition IV"],
  "legalities":{"Modern":"Legal","Legacy":"Legal","Vintage":"Legal",
      "Freeform":"Legal","Prismatic":"Legal","Tribal Wars Legacy":"Legal",
      "Singleton 100":"Legal","Commander":"Legal"}}




*/

export default DS.Model.extend({
  name: DS.attr('string'),
  manaCostFormatted: DS.attr('string'),
  cmc: DS.attr('number'),
  colors: DS.attr(),
  type: DS.attr('string'),
  mainType: DS.attr('string'),
  types: DS.attr(),
  subtypes: DS.attr(),
  text: DS.attr('string'),
  power: DS.attr('number'),
  toughness: DS.attr('number'),
  powerToughnessFormatted: DS.attr('string'),
  imageName: DS.attr('string'),
  isStandard: DS.attr('boolean'),
  isModern: DS.attr('boolean'),
  isLegacy: DS.attr('boolean'),
  isVintage: DS.attr('boolean'),
  recentSet: DS.attr('string'),

  imageUrl: function() {
    let host = 'https://big-furry-monster.herokuapp.com';
    if (ENV.environment === 'development') {
      host = 'http://localhost:3000';
    }
    return host + '/images/' + this.get('name');
  }.property('name'),

  channelFireballPrice: function() {
    //TODO: get host from the card.js adapter
    if (ENV.environment === 'development') {
      return "http://localhost:3000/prices/" + this.get('name');
    } else {
      return "https://big-furry-monster.herokuapp.com/prices/" + this.get('name');
    }
  }.property('name'),

  /** @property {String} display color - e.g. blue; colorless; multicolored */
  displayColor: function() {
    let colors = this.get('colors');
    if (!colors || !colors.length) {
      return 'colorless';
    }
    if (colors.length === 1) {
      return colors[0].toLowerCase();
    }
    return 'multicolored';
  }.property('colors')
});
