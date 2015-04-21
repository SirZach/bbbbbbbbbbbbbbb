import XPaperButton from 'webatrice/components/x-paper-button';

export default XPaperButton.extend({
  timerId: null,

  showTimer: false,

  mouseDown: function () {
    this.setProperties({
      timerId: window.setTimeout(this.heldDownLongEnough.bind(this), 2000),
      showTimer: true
    });
  },

  mouseUp: function () {
    //mousedown was not held down long enough
    if (this.get('timerId')) {
      window.clearTimeout(this.get('timerId'));
      this.setProperties({
        showTimer: false,
        timerId: null
      });

      return false;
    }
  },

  heldDownLongEnough: function () {
    this.set('showTimer', false);

    this.click();
  },

  click: function () {
    //mousedown was held for 2 seconds and now it's retriggering after the mouseup, don't send the click action twice
    if (!this.get('timerId')) {
      return false;
    }

    window.clearTimeout(this.get('timerId'));
    this.set('timerId', null);

    this._super.apply(this, arguments);

    return typeof this.get('bubbles') === 'undefined' || this.get('bubbles') === true;
  }
});
