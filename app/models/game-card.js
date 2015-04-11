import DS from 'ember-data';

export default DS.Model.extend({
  card: DS.belongsTo('card'),
  isTapped: DS.attr('boolean'),
  x: DS.attr('number'),
  y: DS.attr('number'),
  zone: DS.attr('string')
});
