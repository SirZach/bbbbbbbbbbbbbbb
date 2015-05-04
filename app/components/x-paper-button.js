import Ember from 'ember';
import PaperButton from 'ember-paper/components/paper-button';

export default PaperButton.extend({
  attributeBindings: ['target', 'action', 'title'],

  click: function () {
    //stolen from ember-paper
    var target = this.get('target');
    var parameters = target ? [this.get('action')] : ['action'];
    var params = this.get('params');
    var paramsAsArray = Ember.isArray(params) ? params : [params];
    
    parameters = parameters.concat(paramsAsArray);

    if (target) {
      target.send.apply(target, parameters);
    } else {
      this.sendAction.apply(this, parameters);
    }

    return typeof this.get('bubbles') === 'undefined' || this.get('bubbles') === true;
  }
});
