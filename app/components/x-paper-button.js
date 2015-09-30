import Ember from 'ember';
import PaperButton from 'ember-paper/components/paper-button';

export default PaperButton.extend({
  attributeBindings: ['target', 'action', 'title'],

  click() {
    // stolen from ember-paper
    let target = this.get('target');
    let parameters = target ? [this.get('action')] : ['action'];
    let params = this.get('params');
    let paramsAsArray = Ember.isArray(params) ? params : [params];

    parameters = parameters.concat(paramsAsArray);

    if (target) {
      target.send.apply(target, parameters);
    } else {
      this.sendAction.apply(this, parameters);
    }

    return typeof this.get('bubbles') === 'undefined' || this.get('bubbles') === true;
  }
});
