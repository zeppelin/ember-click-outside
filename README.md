# Ember Click Outside [![Build Status](https://travis-ci.org/zeppelin/ember-click-outside.svg)](https://travis-ci.org/zeppelin/ember-click-outside) [![Ember Observer Score](http://emberobserver.com/badges/ember-click-outside.svg)](http://emberobserver.com/addons/ember-click-outside)

A component and mixin for detecting clicks happened outside the element.

## Usage

**As a component**

```hbs
{{#click-outside action=(action "someAction")}}
  Your HTML...
{{/click-outside}}
```

**As a mixin**

In fact, this is the actual implementation of the above component...

```js
import Ember from 'ember';
import ClickOutside from '../mixins/click-outside';
import layout from '../templates/components/click-outside';
const { Component, on } = Ember;
const { next } = Ember.run;

export default Component.extend(ClickOutside, {
  layout,

  clickOutside() {
    this.sendAction();
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

## Development

### Installation

* `git clone` this repository
* `npm install`
* `bower install`

### Running

* `ember server`
* Visit your app at http://localhost:4200.

### Running Tests

* `ember test`
* `ember test --server`

### Building

* `ember build`

For more information on using ember-cli, visit [http://www.ember-cli.com/](http://www.ember-cli.com/).
