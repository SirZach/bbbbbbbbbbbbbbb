import DS from 'ember-data';

export default DS.Model.extend({
    username: DS.attr('string'),
    avatarUrl: DS.attr('string'),
    displayName: DS.attr('string'),
    email: DS.attr('string'),
    visits: DS.attr('number', {defaultValue: 0}),
    presence: DS.belongsTo('presence', {async: true}),
    isAnonymous: DS.attr('boolean', {defaultValue: true})
});
