import ClickOutsideMixin from './mixin';
import Component from '@ember/component';
import { next, cancel } from '@ember/runloop';
import { closest } from './utils';
import { get } from '@ember/object';

export default Component.extend(ClickOutsideMixin, {

  clickOutside(e) {
    if (this.isDestroying || this.isDestroyed) {
      return;
    }

    const exceptSelector = get(this, 'except-selector');
    if (exceptSelector && closest(e.target, exceptSelector)) {
      return;
    }

    let action = get(this, 'action');
    if (typeof action !== 'undefined') {
      action(e);
    }
  },

  didInsertElement() {
    this._super(...arguments);
    this._cancelOutsideListenerSetup = next(this, this.addClickOutsideListener);
  },

  willDestroyElement() {
    cancel(this._cancelOutsideListenerSetup);
    this.removeClickOutsideListener();
  }
});
