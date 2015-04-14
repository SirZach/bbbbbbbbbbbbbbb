import Ember from 'ember';
import PaperButton from 'ember-paper/components/paper-button';

export default PaperButton.extend({
  click: function () {
    //stolen from ember-paper
    var target = this.get('target');
    var params = target ? ['action'] : [this.get('actions')];
    params = params.concat(this.get('params'));

    if (target) {
      target.send.apply(target, params);
    } else {
      this.sendAction.apply(this, params);
    }

    return typeof this.get('bubble') === 'undefined' || this.get('bubbles') === true;
  }
});
