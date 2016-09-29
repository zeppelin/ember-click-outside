import ClickOutside from '../mixins/click-outside';
import layout from '../templates/components/click-outside';
import Component from 'ember-component';
import on from 'ember-evented/on';
import { next, cancel } from 'ember-runloop';
import $ from 'jquery';

export default Component.extend(ClickOutside, {
  layout,

  clickOutside(e) {
    if (this.isDestroying || this.isDestroyed) {
      return;
    }

    const exceptSelector = this.get('except-selector');
    if (exceptSelector && $(e.target).closest(exceptSelector).length > 0) {
      return;
    }

    this.sendAction();
  },

  _attachClickOutsideHandler: on('didInsertElement', function() {
    this._cancelOutsideListenerSetup = next(this, this.addClickOutsideListener);
  }),

  _removeClickOutsideHandler: on('willDestroyElement', function() {
    cancel(this._cancelOutsideListerSetup);
    this.removeClickOutsideListener();
  })
});
