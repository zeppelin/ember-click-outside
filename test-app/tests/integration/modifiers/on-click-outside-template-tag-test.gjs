import ClickOutsideModifier from 'ember-click-outside/modifiers/on-click-outside';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click } from '@ember/test-helpers';

module('Integration | Modifier | on-click-outside GJS', function (hooks) {
  setupRenderingTest(hooks);

  test('smoke test', async function (assert) {
    let didClickOutside = (e) => {
      assert.step(e.target.className);
    };

    await render(
      <template>
        <div class="outside">Somewhere, over the rainbow...</div>
        <div {{ClickOutsideModifier didClickOutside}} class="inside">We're in</div>
      </template>,
    );

    await click('.inside');
    await click('.outside');

    assert.verifySteps(['outside']);
  });
});
