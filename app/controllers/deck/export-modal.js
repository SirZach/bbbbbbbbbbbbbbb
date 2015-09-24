import Ember from 'ember';

export default Ember.Controller.extend({
  actions: {
    close() {
      return this.send('closeModal');
    }
  }
});
