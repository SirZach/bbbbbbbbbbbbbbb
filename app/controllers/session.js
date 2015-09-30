import Ember from 'ember';

export default Ember.Controller.extend({
  isAuthenticated: true,

  // can be guest or user
  authenticationType: 'guest'
});
