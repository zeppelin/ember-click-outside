import ClickOutsideMixin from './mixin';
import Component from '@ember/component';
import { next, cancel } from '@ember/runloop';
import { closest, printConsoleMessage } from './utils';
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

    let onClickOutside = get(this, 'onClickOutside');
    let action = get(this, 'action');

    if (typeof onClickOutside === 'function' && typeof action === 'function') {
      printConsoleMessage(`You've defined both 'onClickOutside' and 'action' handlers. Please use only 'onClickOutside' instead.`);
    }

    // `onClickOutside` handler supersedes the deprecated `action` handler
    if (typeof onClickOutside === 'function') {
      onClickOutside(e);

      return;
    }

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
