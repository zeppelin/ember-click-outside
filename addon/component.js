import ClickOutsideMixin from './mixin';
import Component from '@ember/component';
import { next, cancel } from '@ember/runloop';
import { closest } from './utils';
import { get } from '@ember/object';
import { deprecatingAlias } from '@ember/object/computed';

export default Component.extend(ClickOutsideMixin, {
  'except-selector': deprecatingAlias('exceptSelector', {
    id: 'ember-click-outside.kebab-cased-props',
    until: '2.0.0'
  }),

  action: deprecatingAlias('onClickOutside', {
    id: 'ember-click-outside.action-prop',
    until: '2.0.0'
  }),

  clickOutside(e) {
    if (this.isDestroying || this.isDestroyed) {
      return;
    }

    const exceptSelector = get(this, 'exceptSelector');
    if (exceptSelector && closest(e.target, exceptSelector)) {
      return;
    }

    let onClickOutside = get(this, 'onClickOutside');
    if (typeof onClickOutside === 'function') {
      onClickOutside(e);
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
