import PaperItem from 'ember-paper/components/paper-item';

export default PaperItem.extend({
  canExpand: true,

  isExpanded: false,

  classNameBindings: ['isExpanded'],

  click() {
    this.toggleProperty('isExpanded');
  }
});
