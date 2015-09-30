import Ember from 'ember';

const { Component } = Ember;

function resize(epsilon) {
  let windowHeight = Ember.$(window).height();
  let navHeight = Ember.$('#navbar').outerHeight(true);

  this.$().height(windowHeight - navHeight - epsilon);
}

export default Component.extend({
  epsilon: 40,

  setupResizeListener: function() {
    let epsilon = this.get('epsilon');
    resize.call(this, epsilon);
    Ember.$(window).resize(resize.bind(this, epsilon));
  }.on('didInsertElement'),

  removeListener: function() {
    Ember.$(window).off('resize');
  }.on('willDestroyElement')
});
