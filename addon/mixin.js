import Mixin from '@ember/object/mixin';
import { computed } from '@ember/object';
import $ from 'jquery';

const bound = function(fnName) {
  return computed(fnName, function() {
    let fn = this.get(fnName);
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

    if (!supportsTouchEvents()) {
      return;
    }

    $('body').css('cursor', 'pointer');
  },

  willDestroyElement() {
    this._super(...arguments);

    if (!supportsTouchEvents()) {
      return;
    }

    $('body').css('cursor', '');
  },

  outsideClickHandler(e) {
    const element = this.get('element');
    const $target = $(e.target);

    // Check if the click target still is in the DOM.
    // If not, there is no way to know if it was inside the element or not.
    const isRemoved = $target.length === 0
      || $.contains(document.documentElement, $target[0]) === false;

    // Check the element is found as a parent of the click target.
    const isInside = $target.closest(element).length === 1;

    if (!isRemoved && !isInside) {
      this.clickOutside(e);
    }
  },

  addClickOutsideListener() {
    const clickHandler = this.get('clickHandler');
    $(window).on('click', clickHandler);
  },

  removeClickOutsideListener() {
    const clickHandler = this.get('clickHandler');
    $(window).off('click', clickHandler);
  }
});
