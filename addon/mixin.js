import Mixin from '@ember/object/mixin';
import { computed } from '@ember/object';
import { get } from '@ember/object';

const bound = function(fnName) {
  return computed(fnName, function() {
    let fn = get(this, fnName);
    if (fn) { // https://github.com/zeppelin/ember-click-outside/issues/1
      return fn.bind(this);
    }
  });
};

const supportsTouchEvents = () => {
  return 'ontouchstart' in window || window.navigator.msMaxTouchPoints;
};

export default Mixin.create({
  clickOutside() {},
  clickHandler: bound('outsideClickHandler'),

  didInsertElement() {
    this._super(...arguments);
    
    // https://github.com/zeppelin/ember-click-outside/issues/25
    if (supportsTouchEvents()) {
      return;
    }

    document.body.style.cursor = 'pointer';
  },

  willDestroyElement() {
    this._super(...arguments);

    if (supportsTouchEvents()) {
      return;
    }

    document.body.style.cursor = '';
  },

  outsideClickHandler(e) {
    const element = get(this, 'element');

    // Check if the click target still is in the DOM.
    // If not, there is no way to know if it was inside the element or not.
    const isRemoved = !e.target || !document.contains(e.target);

    // Check the element is found as a parent of the click target.
    const isInside = element === e.target || element.contains(e.target);

    if (!isRemoved && !isInside) {
      this.clickOutside(e);
    }
  },

  addClickOutsideListener() {
    const clickHandler = get(this, 'clickHandler');
    document.addEventListener('click', clickHandler);
  },

  removeClickOutsideListener() {
    const clickHandler = get(this, 'clickHandler');
    document.removeEventListener('click', clickHandler);
  }
});
