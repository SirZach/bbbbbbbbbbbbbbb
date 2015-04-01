import PaperItem from 'ember-paper/components/paper-item';

export default PaperItem.extend({
  notifyToScroll: function () {
    this.get('parentView').send('messageInserted');
  }.on('didInsertElement')
});
