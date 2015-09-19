import PaperItem from 'ember-paper/components/paper-item';

export default PaperItem.extend({
  notifyToScroll: function () {
    let parentView = this.get('parentView');

    if (parentView) {
      parentView.send('messageInserted');
    }
  }.on('didInsertElement')
});
