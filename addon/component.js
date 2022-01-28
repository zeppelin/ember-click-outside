/* eslint-disable ember/no-component-lifecycle-hooks */
/* eslint-disable ember/require-tagless-components */
/* eslint-disable ember/no-classic-classes */
/* eslint-disable ember/no-classic-components */
import Component from '@ember/component';
import { next, cancel } from '@ember/runloop';
import { closest } from './utils';
import { computed } from '@ember/object';
import { get } from '@ember/object';
import { documentOrBodyContains, ios } from './utils';

const bound = function (fnName) {
  return computed(fnName, function () {
    let fn = get(this, fnName);
    if (fn) {
      // https://github.com/zeppelin/ember-click-outside/issues/1
      return fn.bind(this);
    }
    return;
  });
};

export default Component.extend({
  clickHandler: bound('outsideClickHandler'),

  outsideClickHandler(e) {
    const element = this.element;
    const path = e.path || (e.composedPath && e.composedPath());

    if (path) {
      path.includes(element) || this.clickOutside(e);
    } else {
      // Check if the click target still is in the DOM.
      // If not, there is no way to know if it was inside the element or not.
      const isRemoved = !e.target || !documentOrBodyContains(e.target);

      // Check the element is found as a parent of the click target.
      const isInside = element === e.target || element.contains(e.target);

      if (!isRemoved && !isInside) {
        this.clickOutside(e);
      }
    }
  },

  didInsertElement() {
    this._super(...arguments);
    this._cancelOutsideListenerSetup = next(this, this.addClickOutsideListener);

    if (!ios()) {
      return;
    }

    document.body.style.cursor = 'pointer';
  },

  willDestroyElement() {
    this._super(...arguments);
    cancel(this._cancelOutsideListenerSetup);
    this.removeClickOutsideListener();

    if (!ios()) {
      return;
    }

    document.body.style.cursor = '';
  },

  addClickOutsideListener() {
    const eventType = this.eventType || 'click';
    const clickHandler = this.clickHandler;
    document.addEventListener(eventType, clickHandler);
  },

  removeClickOutsideListener() {
    const eventType = this.eventType || 'click';
    const clickHandler = this.clickHandler;
    document.removeEventListener(eventType, clickHandler);
  },

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
});
