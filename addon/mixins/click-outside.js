import Ember from 'ember';
import $ from 'jquery';

const {
  computed
} = Ember;
const bound = function(fnName) {
  return computed(fnName, function() {
    return this.get(fnName).bind(this);
  });
};
const supportsTouchEvents = () => {
  return 'ontouchstart' in window || window.navigator.msMaxTouchPoints;
};

export default Ember.Mixin.create({
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
    const isInside = $target.closest(element).length === 1;

    if (!isInside) {
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
