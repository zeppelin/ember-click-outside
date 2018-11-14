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

const ios = () => {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
};

export default Mixin.create({
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
    const isOnPath = e.path.includes(get(this, 'element'));

    if (!isOnPath) {
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
