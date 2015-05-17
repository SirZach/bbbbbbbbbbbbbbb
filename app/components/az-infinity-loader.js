import Ember from 'ember';
import $ from 'jquery';
import layout from '../templates/components/az-infinity-loader';
import InfinityLoader from 'ember-infinity/components/infinity-loader';

export default InfinityLoader.extend({
  layout: layout,

  tagName: 'az-infinity-loader',

  _checkIfInView: function() {
    var rect = this.element.getBoundingClientRect();
    // Number of pixels away from being in view to be considered close enough.
    var reasonableOffset = 200;

    var inView =
      rect.top >= 0 &&
      rect.left >= 0 &&
      (rect.bottom - rect.height - reasonableOffset) <= $(window).height() &&
      (rect.right - rect.width - reasonableOffset) <= $(window).width();

    if (inView && !this.get('developmentMode')) {
      this.sendAction('loadMoreAction');
    }
  }
});
