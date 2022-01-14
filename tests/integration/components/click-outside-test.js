import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { next } from '@ember/runloop';
import { render, click, settled, triggerEvent } from '@ember/test-helpers';

module(
  'component',
  'Integration | Component | click outside',
  function (hooks) {
    setupRenderingTest(hooks);

    test('smoke test', async function (assert) {
      assert.expect(2);

      this.set('didClickOutside', (e) => {
        assert.ok('`didClickOutside` fired only once');
        assert.equal(
          e.target.className,
          'outside',
          'the event object was passed and is correct'
        );
      });

      await render(hbs`
      <div class="outside">Somewhere, over the rainbow...</div>

      {{#click-outside onClickOutside=(action didClickOutside)}}
        <div class="inside">We're in</div>
      {{/click-outside}}
    `);

      // It's important to fire the actions in the next run loop. Failing to do so
      // would make the outside click not to fire. The reason for this is more
      // often than not the component is rendered as a result of some user
      // interaction, mainly a click. If the component attached the outside click
      // event handler in the same loop, the handler would catch the event and send
      // the action immediately.
      await next(async () => {
        await click('.inside');
        await click('.outside');
      });
      await settled();
    });

    test('real-world scenario', async function (assert) {
      assert.expect(1);
      this.isOpened = false;

      this.open = () => {
        this.set('isOpened', true);
      };

      this.close = () => {
        assert.ok(true, 'The close handler was called');
        this.set('isOpened', false);
      };

      await render(hbs`
      <button data-test-open onclick={{action this.open}}>
        Toggle popover
      </button>

      <div data-test-outside>Outside</div>

      {{#if this.isOpened}}
        {{#click-outside onClickOutside=(action this.close)}}
          Popover is opened.
        {{/click-outside}}
      {{/if}}
    `);

      await click('[data-test-open]');
      await click('[data-test-outside]');
    });

    test(`it doesn't throw without an onClickOutside handler`, async function (assert) {
      assert.expect(0);

      await render(hbs`
      <div class="outside">Somewhere, over the rainbow...</div>

      {{#click-outside}}
        <div class="inside">We're in</div>
      {{/click-outside}}
    `);

      await click('.outside');
    });

    test('except selector', async function (assert) {
      assert.expect(1);

      this.set('didClickOutside', () => {
        assert.ok('`didClickOutside` fired only once');
      });

      await render(hbs`
      <div class="outside">Somewhere, over the rainbow...</div>

      <div class="except-outside">
        Somewhere, under the rainbow...
      </div>

      {{#click-outside exceptSelector=".except-outside" onClickOutside=(action didClickOutside)}}
      {{/click-outside}}
    `);

      // It's important to fire the actions in the next run loop. Failing to do so
      // would make the outside click not to fire. The reason for this is more
      // often than not the component is rendered as a result of some user
      // interaction, mainly a click. If the component attached the outside click
      // event handler in the same loop, the handler would catch the event and send
      // the action immediately.
      await next(async () => {
        await click('.outside');
        await click('.except-outside');
      });
      await settled();
    });

    test('deprecated `except-selector` still works', async function (assert) {
      assert.expect(2);

      this.set('didClickOutside', () => {
        assert.ok('`didClickOutside` fired only once');
      });

      await render(hbs`
      <div class="outside">Somewhere, over the rainbow...</div>

      <div class="except-outside">
        Somewhere, under the rainbow...
      </div>

      {{#click-outside except-selector=".except-outside" onClickOutside=(action didClickOutside)}}
      {{/click-outside}}
    `);

      // It's important to fire the actions in the next run loop. Failing to do so
      // would make the outside click not to fire. The reason for this is more
      // often than not the component is rendered as a result of some user
      // interaction, mainly a click. If the component attached the outside click
      // event handler in the same loop, the handler would catch the event and send
      // the action immediately.
      await next(async () => {
        await click('.outside');
        await click('.except-outside');
      });
      await settled();

      assert.expectDeprecation();
    });

    test('event type', async function (assert) {
      assert.expect(1);

      this.set('didClickOutside', () => {
        assert.ok('`didClickOutside` fired only once');
      });

      this.set('toggleFlag', () => {
        this.set('topSide', true);
      });

      await render(hbs`
      {{#if topSide}}
        Blue
      {{else}}
        <div class="outside" {{action "toggleFlag"}}>Yellow</div>
      {{/if}}

      {{#click-outside eventType='mousedown' onClickOutside=(action didClickOutside)}}
      {{/click-outside}}
    `);

      await next(async () => {
        await triggerEvent('.outside', 'mousedown');
      });
      await settled();
    });

    test('handle removed DOM element outside', async function (assert) {
      assert.expect(1);

      this.set('didClickOutside', () => {
        assert.ok('`didClickOutside` fired only once');
      });

      this.set('toggleFlag', () => {
        this.set('topSide', true);
      });

      await render(hbs`
      {{#if topSide}}
        Blue
      {{else}}
        <div class="outside" {{action "toggleFlag"}}>Yellow</div>
      {{/if}}

      {{#click-outside onClickOutside=(action didClickOutside)}}
      {{/click-outside}}
    `);

      await next(async () => {
        await click('.outside');
      });
      await settled();
    });

    test('`action` handler is still valid', async function (assert) {
      assert.expect(2);

      this.setProperties({
        onClickOutside: () => assert.ok('`onClickOutside` fired once'),
      });

      await render(hbs`
      <div class="outside">Somewhere, over the rainbow...</div>

      {{#click-outside action=(action onClickOutside)}}
        <div class="inside">We're in</div>
      {{/click-outside}}
    `);

      await next(async () => {
        await click('.inside');
        await click('.outside');
      });
      await settled();

      assert.expectDeprecation();
    });
  }
);
