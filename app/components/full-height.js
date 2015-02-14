import Ember from 'ember';

function resize (epsilon) {
  var windowHeight = Ember.$(window).height(),
      navHeight = Ember.$('#navbar').outerHeight(true);

  this.$().height(windowHeight - navHeight - epsilon);
}

export default Ember.Component.extend({
  epsilion: 0,

  didInsertElement: function () {
    var epsilon = this.get('epsilon');
    resize.call(this, epsilon);
    Ember.$(window).resize(resize.bind(this, epsilon));
  }
});
