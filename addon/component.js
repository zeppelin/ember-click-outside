/* eslint-disable ember/no-component-lifecycle-hooks */
/* eslint-disable ember/require-tagless-components */
/* eslint-disable ember/no-classic-classes */
/* eslint-disable ember/no-classic-components */
import ClickOutsideMixin from './mixin';
import Component from '@ember/component';
import { next, cancel } from '@ember/runloop';
import { closest } from './utils';

export default Component.extend(ClickOutsideMixin, {
  clickOutside(e) {
    if (this.isDestroying || this.isDestroyed) {
      return;
    }

    const exceptSelector = this.exceptSelector;
    if (exceptSelector && closest(e.target, exceptSelector)) {
      return;
    }

    let onClickOutside = this.onClickOutside;
    if (typeof onClickOutside === 'function') {
      onClickOutside(e);
    }
  },

  didInsertElement() {
    this._super(...arguments);
    this._cancelOutsideListenerSetup = next(this, this.addClickOutsideListener);
  },

  willDestroyElement() {
    this._super(...arguments);
    cancel(this._cancelOutsideListenerSetup);
    this.removeClickOutsideListener();
  },
});
