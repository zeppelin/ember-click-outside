# ember-click-outside [![Build Status](https://travis-ci.org/zeppelin/ember-click-outside.svg)](https://travis-ci.org/zeppelin/ember-click-outside) [![Ember Observer Score](http://emberobserver.com/badges/ember-click-outside.svg)](http://emberobserver.com/addons/ember-click-outside)

A set of tools for detecting click events fired outside an element.

![click outside logo](click-outside-logo.png)

## Installation

* Ember.js v3.20 or above
* Ember CLI v3.20 or above
* Node.js v12 or above

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

## Behavior

For every click in the document, `ember-click-outside` will check if the click target is outside of its component, and trigger the provided action/callback if so.

If the click target cannot be found in the document (probably because it has been deleted before `ember-click-outside` detected the click), no action/callback is triggered, since we cannot check if it is inside or outside of the component.
