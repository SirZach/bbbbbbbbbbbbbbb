import Ember from 'ember';

function resize (epsilon) {
  var windowHeight = Ember.$(window).height(),
      navHeight = Ember.$('#navbar').outerHeight(true);

  this.$().height(windowHeight - navHeight - epsilon);
}

export default Ember.Component.extend({
  epsilon: 40,

  setupResizeListener: function () {
    var epsilon = this.get('epsilon');
    resize.call(this, epsilon);
    Ember.$(window).resize(resize.bind(this, epsilon));
  }.on('didInsertElement'),

  removeListener: function () {
    Ember.$(window).off('resize');
  }.on('willDestroyElement')
});
