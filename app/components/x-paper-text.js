import PaperText from 'ember-paper/components/paper-input';
import layout from '../templates/components/x-paper-text';

export default PaperText.extend({
  layout: layout,

  /** @property {String} channel name for the chat */
  channel: null,

  /** @property {String} controller name to reset the says property */
  controllerName: null,

  actions: {
    onEnter: function () {
      this.sendAction('action', this.get('value'), this.get('channel'), this.get('controllerName'));
    }
  }
});
