import ClickOutsideMixin from './mixin';
import Component from '@ember/component';
import { next, cancel } from '@ember/runloop';
import $ from 'jquery';

export default Component.extend(ClickOutsideMixin, {

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

  didInsertElement() {
    this._super(...arguments);
    this._cancelOutsideListenerSetup = next(this, this.addClickOutsideListener);
  },

  willDestroyElement() {
    cancel(this._cancelOutsideListerSetup);
    this.removeClickOutsideListener();
  }
});
