# ember-click-outside [![Build Status](https://travis-ci.org/zeppelin/ember-click-outside.svg)](https://travis-ci.org/zeppelin/ember-click-outside) [![Ember Observer Score](http://emberobserver.com/badges/ember-click-outside.svg)](http://emberobserver.com/addons/ember-click-outside)

A set of tools for detecting click events fired outside an element.

![click outside logo](click-outside-logo.png)

## Installation

From within your ember-cli project directory install the addon:

```bash
ember install ember-click-outside
```

## Usage

### As element modifier (recommended)

```hbs
<div {{on-click-outside (action "someAction")}}>
  Your HTML...
</div>
```

*If you're running ember-source <3.8, you need install [ember-modifier-manager-polyfill](https://github.com/rwjblue/ember-modifier-manager-polyfill) to get the modifier working.*

### As a component

```hbs
<ClickOutside @onClickOutside={{action "someAction"}}>
  Your HTML...
</ClickOutside>
```

```js
  ...
  actions: {
    // Called on click outside
    someAction(e /* click event object */) {

    },
  },
  ...
```

If you wish to exclude certain elements from counting as outside clicks, use
the `exceptSelector` attribute:

```hbs
<ClickOutside @onClickOutside={{action "someAction"}} @exceptSelector=".some-selector">
  Your HTML...
</ClickOutside>
```

You can listen for events other than `click` by using the `eventType` attribute:

```hbs
<ClickOutside @onClickOutside={{action "someAction"}} @eventType="mousedown">
  Your HTML...
</ClickOutside>
```

### As a mixin

This is somewhat more advanced, but if that's fine, feel free:

<details>
<summary>Using ember-click-outside component mixin</summary>

Here is a simplified version of the implementation of the component above:

```js
import Component from '@ember/component';
import { on } from '@ember/object/evented';
import { next } from '@ember/runloop';
import ClickOutsideMixin from 'ember-click-outside/mixin';

export default Component.extend(ClickOutsideMixin, {
  clickOutside(e) {
    this.get('onClickOutside')(e);
  },

  _attachClickOutsideHandler: on('didInsertElement', function() {
    next(this, this.addClickOutsideListener);
  }),

  _removeClickOutsideHandler: on('willDestroyElement', function() {
    this.removeClickOutsideListener();
  })
});
```

**Note:** You should almost always call `this.addClickOutsideListener` inside
the next run loop when you want to set it up on `didInsertElement`. The reason
for this is more often than not the component is rendered as a result of some
user interaction, usually a click. If the component attached the outside click
event handler in the same loop, the handler would catch the event and fire the
callback immediately.

**Note:** If you need to override the `didInsertElement` and/or
`willDestroyElement` lifecycle hooks, you must make sure to call
`this._super(...arguments)` in them because the mixin implements them as well.

```js
export default Component.extend(ClickOutsideMixin, {
  didInsertElement() {
    this._super(...arguments);

    // Something else you may want to run when the
    // element in inserted in the DOM
  },

  willDestroyElement() {
    this._super(...arguments);

    // Something else you may want to run when the
    // element in removed from the DOM
  }
});
```
</details>

## Behavior

For every click in the document, `ember-click-outside` will check if the click target is outside of its component, and trigger the provided action/callback if so.

If the click target cannot be found in the document (probably because it has been deleted before `ember-click-outside` detected the click), no action/callback is triggered, since we cannot check if it is inside or outside of the component.
