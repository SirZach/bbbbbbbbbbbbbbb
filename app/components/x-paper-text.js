import PaperText from 'ember-paper/components/paper-text';
import layout from '../templates/components/x-paper-text';

export default PaperText.extend({
  layout: layout,
  actions: {
    onEnter: function () {
      this.sendAction('action', this.get('value'));
    }
  }
});
