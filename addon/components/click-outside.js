import Ember from 'ember';
import ClickOutside from '../mixins/click-outside';
import layout from '../templates/components/click-outside';
import $ from 'jquery';
const { Component, on, run } = Ember;
const { next } = Ember.run;

export default Component.extend(ClickOutside, {
  layout,

  clickOutside(e) {
    const exceptSelector = this.get('except-selector');
    if (exceptSelector && $(e.target).closest(exceptSelector).length > 0) {
      return;
    }

    this.sendAction();
  },

  _attachClickOutsideHandler: on('didInsertElement', function() {
    this._cancelOutsideListenerSetup = next(this, this.addClickOutsideListener);
  }),

  _removeClickOutsideHandler: on('willDestroyElement', function() {
    run.cancel(this._cancelOutsideListerSetup);
    this.removeClickOutsideListener();
  })
});
