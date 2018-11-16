import { module, test } from 'qunit'
import { setupRenderingTest } from 'ember-qunit'
import hbs from 'htmlbars-inline-precompile'
import { next } from '@ember/runloop'
import { render, click } from '@ember/test-helpers'

module('click-outside', 'Integration | Component | click outside', function(hooks) {
  setupRenderingTest(hooks)

  test('smoke test', async function(assert) {
    assert.expect(2)

    this.set('didClickOutside', e => {
      assert.ok('`didClickOutside` fired only once')
      assert.equal(e.target.className, 'outside', 'the event object was passed and is correct')
    })

    await render(hbs`
      <div class="outside">Somewhere, over the rainbow...</div>

      {{#click-outside action=(action didClickOutside)}}
        <div class="inside">We're in</div>
      {{/click-outside}}
    `)

    /*
      It's important to fire the actions in the next run loop. Failing to do so
      would make the outside click not to fire. The reason for this is more
      often than not the component is rendered as a result of some user
      interaction, mainly a click. If the component attached the outside click
      event handler in the same loop, the handler would catch the event and send
      the action immediately.
    */
    await next(async () => {
      await click('.inside')
      await click('.outside')
    })
  })

  test(`it doesn't throw without an action handler`, async assert => {
    assert.expect(0)

    await render(hbs`
      <div class="outside">Somewhere, over the rainbow...</div>

      {{#click-outside}}
        <div class="inside">We're in</div>
      {{/click-outside}}
    `)

    await click('.outside')
  })

  test('except selector', async function(assert) {
    assert.expect(1)

    this.set('didClickOutside', () => {
      assert.ok('`didClickOutside` fired only once')
    })

    await render(hbs`
      <div class="outside">Somewhere, over the rainbow...</div>

      <div class="except-outside">
        Somewhere, under the rainbow...
      </div>

      {{#click-outside except-selector=".except-outside" action=(action didClickOutside)}}
      {{/click-outside}}
    `)

    /*
      It's important to fire the actions in the next run loop. Failing to do so
      would make the outside click not to fire. The reason for this is more
      often than not the component is rendered as a result of some user
      interaction, mainly a click. If the component attached the outside click
      event handler in the same loop, the handler would catch the event and send
      the action immediately.
    */
    await next(async () => {
      await click('.outside')
      await click('.except-outside')
    })
  })

  test('handle removed DOM element outside', async function(assert) {
    assert.expect(1)

    this.set('didClickOutside', () => {
      assert.ok('`didClickOutside` fired only once')
    })

    this.set('toggleFlag', () => {
      this.set('topSide', true)
    })

    await render(hbs`
      {{#if topSide}}
        Blue
      {{else}}
        <div class="outside" {{action "toggleFlag"}}>Yellow</div>
      {{/if}}
      
      {{#click-outside action=(action didClickOutside)}}
      {{/click-outside}}
    `)

    await next(async () => {
      await click('.outside')
    })
  })
})
