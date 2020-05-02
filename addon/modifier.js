import { next, cancel } from '@ember/runloop';
import Modifier from 'ember-modifier';

import { closest, documentOrBodyContains, ios } from './utils';

export default class ClickOutsideModifier extends Modifier {
  action = null;
  capture = null;
  eventHandler = null;
  eventType = 'click';
  exceptSelector = null;

  cancelOutsideListenerSetup = null;

  didInstall() {
    this._init();

    if (ios()) {
      document.body.style.cursor = 'pointer';
    }
  }

  didUpdateArguments() {
    this._destroy();
    this._init();
  }

  willRemove() {
    this._destroy();

    if (ios()) {
      document.body.style.cursor = '';
    }
  }

  _init() {
    let [action] = this.args.positional;
    let { capture, eventType, exceptSelector } = this.args.named;

    if (!action) {
      return;
    }

    this.action = action;
    this.exceptSelector = exceptSelector;
    this.capture = capture;

    if (eventType) {
      this.eventType = eventType;
    }

    this.eventHandler = this._createHandler(this.element, this.action, this.exceptSelector);
    this.cancelOutsideListenerSetup = next(this, this._addClickOutsideListener);
  }

  _destroy() {
    if (!this.action) {
      return;
    }

    cancel(this.cancelOutsideListenerSetup);
    this._removeClickOutsideListener();
  }

  _addClickOutsideListener() {
    let { capture, eventHandler, eventType } = this;
    document.addEventListener(eventType, eventHandler, { capture });
  }

  _removeClickOutsideListener() {
    let { capture, eventHandler, eventType } = this;
    document.removeEventListener(eventType, eventHandler, { capture });
  }

  _createHandler(element, action, exceptSelector) {
    return (e) => {
      if (exceptSelector && closest(e.target, exceptSelector)) {
        return;
      }

      let path = e.path || (e.composedPath && e.composedPath());

      if (path) {
        path.includes(element) || action(e);
      } else {
        // Check if the click target still is in the DOM.
        // If not, there is no way to know if it was inside the element or not.
        let isRemoved = !e.target || !documentOrBodyContains(e.target);

        // Check the element is found as a parent of the click target.
        let isInside = element === e.target || element.contains(e.target);

        if (!isRemoved && !isInside) {
          action(e);
        }
      }
    };
  }
}
