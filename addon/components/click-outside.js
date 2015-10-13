import Ember from 'ember';
import ClickOutside from '../mixins/click-outside';
import layout from '../templates/components/click-outside';
const { Component, on } = Ember;
const { next } = Ember.run;

export default Component.extend(ClickOutside, {
  layout,

  clickOutside() {
    this.sendAction();
  },

  _attachClickOutsideHandler: on('didInsertElement', function() {
    next(this, this.addClickOutsideListener);
  }),

  _removeClickOutsideHandler: on('willDestroyElement', function() {
    this.removeClickOutsideListener();
  })
});
