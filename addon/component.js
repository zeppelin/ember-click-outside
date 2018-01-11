import ClickOutsideMixin from './mixin';
import Component from '@ember/component';
import { next, cancel } from '@ember/runloop';
import { closest } from './utils';

export default Component.extend(ClickOutsideMixin, {

  clickOutside(e) {
    if (this.isDestroying || this.isDestroyed) {
      return;
    }

    const exceptSelector = this.get('except-selector');
    if (exceptSelector && closest(e.target, exceptSelector)) {
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
