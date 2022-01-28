import EmberObject from '@ember/object';
import ClickOutsideMixin from 'ember-click-outside/mixin';
import { module, test } from 'qunit';
import { getDeprecations } from '@ember/test-helpers';
import { setupTest } from 'ember-qunit';

module('Unit | Mixin', function (hooks) {
  setupTest(hooks);

  test('raises deprecation warning', function (assert) {
    EmberObject.extend(ClickOutsideMixin).create();

    assert.ok(
      getDeprecations().some(
        (d) =>
          d.message ===
          'Using the ClickOutsideMixin is deprecated and will be removed. Please consider migrating to the `{{click-outside}}` modifier'
      ),
      'ClickOutsideMixin deprecation was raised'
    );
  });
});
