import {
  click,
  getDeprecations,
  render,
  triggerEvent,
} from '@ember/test-helpers';
import { setupRenderingTest } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { module, test } from 'qunit';

module(
  'component',
  'Integration | Component | click outside',
  function (hooks) {
    setupRenderingTest(hooks);

    test('raises deprecation warning', async function (assert) {
      this.set('noop', () => {});

      await render(hbs`
        <ClickOutside @onClickOutside={{this.noop}}></ClickOutside>
      `);

      assert.ok(
        getDeprecations().some(
          (d) =>
            d.message ===
            'Using the <ClickOutside> component is deprecated and will be removed. Please consider migrating to the `{{on-click-outside}}` modifier'
        ),
        '<ClickOutside> component deprecation was raised'
      );
    });

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

        <ClickOutside @onClickOutside={{this.didClickOutside}}>
          <div class="inside">We're in</div>
        </ClickOutside>
      `);

      await click('.inside');
      await click('.outside');
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
        <button data-test-open {{on "click" this.open}}>
          Toggle popover
        </button>

        <div data-test-outside>Outside</div>

        {{#if this.isOpened}}
          <ClickOutside @onClickOutside={{this.close}}>
            Popover is opened.
          </ClickOutside>
        {{/if}}
      `);

      await click('[data-test-open]');
      await click('[data-test-outside]');
    });

    test(`it doesn't throw without an onClickOutside handler`, async function (assert) {
      assert.expect(0);

      await render(hbs`
        <div class="outside">Somewhere, over the rainbow...</div>

        <ClickOutside>
          <div class="inside">We're in</div>
        </ClickOutside>
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

        <ClickOutside @exceptSelector=".except-outside" @onClickOutside={{this.didClickOutside}}>
        </ClickOutside>
      `);

      await click('.outside');
      await click('.except-outside');
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
        {{#if this.topSide}}
          Blue
        {{else}}
          <div class="outside" {{action "toggleFlag"}}>Yellow</div>
        {{/if}}

        <ClickOutside @eventType="mousedown" @onClickOutside={{this.didClickOutside}}>
        </ClickOutside>
      `);

      await triggerEvent('.outside', 'mousedown');
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
        {{#if this.topSide}}
          Blue
        {{else}}
          <div class="outside" {{action "toggleFlag"}}>Yellow</div>
        {{/if}}

        <ClickOutside @onClickOutside={{this.didClickOutside}}></ClickOutside>
      `);

      await click('.outside');
    });
  }
);
