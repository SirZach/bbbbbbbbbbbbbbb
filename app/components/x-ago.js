import Ember from 'ember';
import layout from '../templates/components/x-ago';

export default Ember.Component.extend({
  layout: layout,

  tagName: 'span',

  time: function () {
    return this.get('date').getTime();
  }.property('date'),

  startTimer: function () {
    var currentTime = this.get('time');
    this.set('time', currentTime - 6000);
    this.scheduleStartTimer();
  },

  scheduleStartTimer: function () {
    this._timer = Ember.run.later(this, 'startTimer', 6000);
  }.on('didInsertElement'),

  killTimer: function () {
    Ember.run.cancel(this._timer);
  }.on('willDestroyElement')
});
