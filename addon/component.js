import ClickOutsideMixin from './mixin';
import Component from '@ember/component';
import { next, cancel } from '@ember/runloop';
import { closest } from './utils';
import { get } from '@ember/object';
import { printConsoleMessage } from './utils';

export default Component.extend(ClickOutsideMixin, {

  clickOutside(e) {
    if (this.isDestroying || this.isDestroyed) {
      return;
    }

    const exceptSelector = get(this, 'except-selector');
    if (exceptSelector && closest(e.target, exceptSelector)) {
      return;
    }

    // `onClickOutside` handler supersedes the deprecated `action` handler
    let onClickOutside = get(this, 'onClickOutside');
    if (typeof onClickOutside === 'function') {
      onClickOutside(e);

      return;
    }

    let action = get(this, 'action');
    if (typeof action === 'function') {
      printConsoleMessage(`Using 'action' is deprecated. Please use 'onClickOutside' instead.`);
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
