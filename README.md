ember-click-outside [![Ember Observer Score](http://emberobserver.com/badges/ember-click-outside.svg)](http://emberobserver.com/addons/ember-click-outside)
==============================================================================

A handy modifier for detecting click events fired outside an element.

![click outside logo](click-outside-logo.png)

Compatibility
------------------------------------------------------------------------------

* Ember.js v3.4 or above
* Embroider or ember-auto-import v2

*If you're running ember-source <3.22, you need to install [ember-destroyable-polyfill](https://github.com/ember-polyfills/ember-destroyable-polyfill) to get the modifier working.*

*If you're running ember-source <3.8, you need to install [ember-modifier-manager-polyfill](https://github.com/rwjblue/ember-modifier-manager-polyfill) to get the modifier working.*

Installation
------------------------------------------------------------------------------

From within your ember-cli project directory install the addon:
```bash
ember install ember-click-outside
```

Usage
------------------------------------------------------------------------------

```hbs
<div {{on-click-outside this.someAction}}>
  Your HTML...
</div>
```

If you wish to exclude certain elements from counting as outside clicks, use
the `exceptSelector` attribute:

```hbs
<div {{on-click-outside this.someAction exceptSelector=".some-selector"}}>
  Your HTML...
</div>
```

You can listen for events other than `click` by using the `eventType` attribute:

```hbs
<div {{on-click-outside this.someAction eventType="mousedown"}}>
  Your HTML...
</div>
```

How it works?
------------------------------------------------------------------------------

For every click in the document, `ember-click-outside` will check if the click target is outside of its element, and trigger the provided action/callback if so.

If the click target cannot be found in the document (probably because it has been removed before `ember-click-outside` detected the click), no action/callback is triggered, since we cannot check if it is inside or outside of the element.


Contributing
------------------------------------------------------------------------------

See the [Contributing](CONTRIBUTING.md) guide for details.


License
------------------------------------------------------------------------------

This project is licensed under the [MIT License](LICENSE.md).
