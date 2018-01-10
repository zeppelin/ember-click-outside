import ClickOutside from '../mixins/click-outside';
import Component from '@ember/component';
import { on } from '@ember/object/evented';
import { next, cancel } from '@ember/runloop';
import $ from 'jquery';

export default Component.extend(ClickOutside, {

  clickOutside(e) {
    if (this.isDestroying || this.isDestroyed) {
      return;
    }

    const exceptSelector = this.get('except-selector');
    if (exceptSelector && $(e.target).closest(exceptSelector).length > 0) {
      return;
    }

    let action = this.get('action');
    if (typeof action !== 'undefined') {
      action(e);
    }
  },

  _attachClickOutsideHandler: on('didInsertElement', function() {
    this._cancelOutsideListenerSetup = next(this, this.addClickOutsideListener);
  }),

  _removeClickOutsideHandler: on('willDestroyElement', function() {
    cancel(this._cancelOutsideListerSetup);
    this.removeClickOutsideListener();
  })
});
