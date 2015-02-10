import Ember from 'ember';
import filterableMixin from '../mixins/filterable_mixin';

export default Ember.ArrayController.extend(filterableMixin, {
  filtersActive: false,

  filterProperties: [
    {
      label: 'Card Types',
      propertyName: 'mainType',
      values: ['Creature', 'Enchantment', 'Land', 'Instant', 'Sorcery', 'Artifact'],
      possibleValues: ['Creature', 'Enchantment', 'Land', 'Instant', 'Sorcery', 'Artifact'],
      valuesDisplay: ['Creature', 'Enchantment', 'Land', 'Instant', 'Sorcery', 'Artifact'],
      and: false
    },
    {
      label: 'Color',
      propertyName: 'colors',
      values: [ 'Black', 'Blue', 'Green', 'Red', 'White'],
      possibleValues: [ 'Black', 'Blue', 'Green', 'Red', 'White'],
      valuesDisplay: [ 'Black', 'Blue', 'Green', 'Red', 'White'],
      and: false
    },
    {
      label: 'Legalities',
      propertyName: 'legal',
      values: [ 'isStandard', 'isModern', 'isLegacy', 'isVintage'],
      possibleValues: [ 'isStandard', 'isModern', 'isLegacy', 'isVintage'],
      valuesDisplay: [ 'Standard', 'Modern', 'Legacy', 'Vintage'],
      and: false
    }
  ],
  typesSelected: [],

  colorsSelected: [],

  legalitiesSelected: [],

  filteredCards: function () {
    var cards = this.get('arrangedContent'),
        typesSelected = this.get('typesSelected'),
        colorsSelected = this.get('colorsSelected'),
        legalitiesSelected = this.get('legalitiesSelected').map(function (l) {
          return 'is' + l;
        });

    if (typesSelected.length) {
      cards = cards.filter(function (c) {
        return typesSelected.contains(c.get('mainType'));
      });
    }

    if (colorsSelected.length) {
      cards = cards.filter(function (c) {
        var found = false,
            colors = c.get('colors');
        if (!colors) {
          return false;
        }
        colors.forEach(function (color) {
          if (colorsSelected.contains(color)) {
            found = true;
          }
        });
        return found;
      });
    }

    if (legalitiesSelected.length) {
      cards = cards.filter(function (c) {
        var isLegal = false;
        legalitiesSelected.forEach(function (l) {
          if (c.get(l)) {
            isLegal = true;
          }
        });

        return isLegal;
      });
    }

    return cards;
  }.property('arrangedContent', 'typesSelected.[]',
    'colorsSelected.[]', 'legalitiesSelected.[]'),

  displayCards: function () {
    return this.get('searchedContent').slice(0, 100);
  }.property('searchedContent'),

  searchedContent: function () {
    var searchTerm = this.get('searchTerm'),
        filteredCards = this.get('filteredCards');

    if (!searchTerm) {
      return filteredCards;
    }

    return filteredCards.filter(function (c) {
      return c.name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
    });
  }.property('filteredCards', 'searchTerm'),

  /** @property {String} the current search term */
  searchTerm: '',

  actions: {
    toggle: function (propertyName) {
      this.toggleProperty(propertyName);
    }
  }
});
