/* eslint-disable ember/no-component-lifecycle-hooks */
/* eslint-disable ember/require-tagless-components */
/* eslint-disable ember/no-classic-classes */
/* eslint-disable ember/no-classic-components */
import ClickOutsideMixin from './mixin';
import Component from '@ember/component';
import { next, cancel } from '@ember/runloop';
import { closest } from './utils';
import { deprecatingAlias } from '@ember/object/computed';

export default Component.extend(ClickOutsideMixin, {
  'except-selector': deprecatingAlias('exceptSelector', {
    id: 'ember-click-outside.kebab-cased-props',
    since: '1.1.0',
    until: '2.0.0',
    for: 'ember-click-outside',
  }),

  action: deprecatingAlias('onClickOutside', {
    id: 'ember-click-outside.action-prop',
    since: '1.1.0',
    until: '2.0.0',
    for: 'ember-click-outside',
  }),

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

  didInsertElement() {
    this._super(...arguments);
    this._cancelOutsideListenerSetup = next(this, this.addClickOutsideListener);
  },

  willDestroyElement() {
    this._super(...arguments);
    cancel(this._cancelOutsideListenerSetup);
    this.removeClickOutsideListener();
  },
});
