import Ember from 'ember';
import $ from 'jquery';

const {
  computed
} = Ember;
const bound = function(fnName) {
  return computed(fnName, function() {
    let fn = this.get(fnName);
    if (fn) { // https://github.com/zeppelin/ember-click-outside/issues/1
      return fn.bind(this);
    }
  });
};

export default Ember.Mixin.create({
  clickOutside() {},
  clickHandler: bound('outsideClickHandler'),

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
