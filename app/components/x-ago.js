import Ember from 'ember';
import layout from '../templates/components/x-ago';

export default Ember.Component.extend({
  layout,

  tagName: 'span',

  /** @property {Time} the time of the object */
  time: function() {
    return this.get('date');
  }.property('date'),

  /** @property {Epoch} the current clock time */
  xTime: null,

  startTimer() {
    this.set('xTime', Date.now());
    this.scheduleStartTimer();
  },

  scheduleStartTimer: function() {
    this.set('xTime', Date.now());
    this._timer = Ember.run.later(this, 'startTimer', 60000);
  }.on('didInsertElement'),

  killTimer: function() {
    Ember.run.cancel(this._timer);
  }.on('willDestroyElement')
});
