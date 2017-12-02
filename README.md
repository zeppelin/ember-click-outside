# ember-click-outside [![Build Status](https://travis-ci.org/zeppelin/ember-click-outside.svg)](https://travis-ci.org/zeppelin/ember-click-outside) [![Ember Observer Score](http://emberobserver.com/badges/ember-click-outside.svg)](http://emberobserver.com/addons/ember-click-outside)

A component and mixin for detecting clicks happened outside the element.

## Installation

From within your ember-cli project directory:

```bash
ember install ember-click-outside
```

## Usage

**As a component**

```hbs
{{#click-outside action=(action "someAction")}}
  Your HTML...
{{/click-outside}}
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
the `except-selector` attribute:

```hbs
{{#click-outside action=(action "someAction") except-selector=".some-selector"}}
  Your HTML...
{{/click-outside}}
```

**As a mixin**

In fact, here is a simplified of implementation of the above component...

```js
import Ember from 'ember';
import ClickOutside from '../mixins/click-outside';
import layout from '../templates/components/click-outside';
const { Component, on } = Ember;
const { next } = Ember.run;

export default Component.extend(ClickOutside, {
  layout,

  clickOutside(e) {
    this.get('action')(e);
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
the next run loop when you want to set it un on `didInsertElement`. The reason
for this is more often than not the component is rendered as a result of some
user interaction, usually a click. If the component attached the outside click
event handler in the same loop, the handler would catch the event and fire the
callback immediately.

**Note:** If you need to override the `didInsertElement` and/or
`willDestroyElement` lifecycle hooks, you must make sure to call
`this._super(...arguments)` in them because the mixin implements them as well.

```js
export default Component.extend(ClickOutside, {
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

## Behavior

For every click in the document, `ember-click-outside` will check if the click target is outside of its component, and trigger the provided action/callback if so.

If the click target cannot be found in the document (probably because it has been deleted before `ember-click-outside` detected the click), no action/callback is triggered, since we cannot check if it is inside or outside of the component.

## Development

### Installation

* `git clone https://github.com/zeppelin/ember-click-outside` this repository
* `cd ember-click-outside`
* `npm install`

### Running

* `ember serve`
* Visit your app at [http://localhost:4200](http://localhost:4200).

### Running Tests

* `npm test` (Runs `ember try:each` to test your addon against multiple Ember versions)
* `ember test`
* `ember test --server`

### Building

* `ember build`

For more information on using ember-cli, visit [https://ember-cli.com/](https://ember-cli.com/).
