/* eslint-disable ember/no-new-mixins */
import Mixin from '@ember/object/mixin';
import { computed } from '@ember/object';
import { get } from '@ember/object';
import { deprecate } from '@ember/debug';

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

export default Mixin.create({
  init(...args) {
    this._super(...args);

    deprecate(
      'Using the ClickOutsideMixin is deprecated and will be removed. Please consider migrating to the `{{click-outside}}` modifier',
      false,
      {
        id: 'ember-click-outside.mixin',
        since: '4.0.0',
        until: '5.0.0',
        for: 'ember-click-outside',
      }
    );
  },

  clickOutside() {},
  clickHandler: bound('outsideClickHandler'),

  didInsertElement() {
    this._super(...arguments);

    if (!ios()) {
      return;
    }

    document.body.style.cursor = 'pointer';
  },

  willDestroyElement() {
    this._super(...arguments);

    if (!ios()) {
      return;
    }

    document.body.style.cursor = '';
  },

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
});
