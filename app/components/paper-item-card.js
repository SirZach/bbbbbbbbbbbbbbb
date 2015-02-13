import PaperItem from 'ember-paper/components/paper-item';

export default PaperItem.extend({

  click: function () {
    var card = this.get('card');
    this.sendAction('action', card);
  }
});
