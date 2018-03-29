import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { next } from '@ember/runloop';
import { click } from 'ember-native-dom-helpers';

moduleForComponent('click-outside', 'Integration | Component | click outside', {
  integration: true
});

test('smoke test', function(assert) {
  assert.expect(2);

  this.on('didClickOutside', function(e) {
    assert.ok('`didClickOutside` fired only once');
    assert.equal(e.target.className, 'outside', 'the event object was passed and is correct');
  });

  this.render(hbs`
    <div class="outside">Somewhere, over the rainbow...</div>

    {{#click-outside action=(action "didClickOutside")}}
      <div class="inside">We're in</div>
    {{/click-outside}}
  `);

  // It's important to fire the actions in the next run loop. Failing to do so
  // would make the outside click not to fire. The reason for this is more
  // often than not the component is rendered as a result of some user
  // interaction, mainly a click. If the component attached the outside click
  // event handler in the same loop, the handler would catch the event and send
  // the action immediately.
  next(()=> {
    click('.inside');
    click('.outside');
  });
});

test(`it doesn't throw without an action handler`, function(assert) {
  assert.expect(0);

  this.render(hbs`
    <div class="outside">Somewhere, over the rainbow...</div>

    {{#click-outside}}
      <div class="inside">We're in</div>
    {{/click-outside}}
  `);

  click('.outside');
});

test('except selector', function(assert) {
  assert.expect(1);

  this.on('didClickOutside', function() {
    assert.ok('`didClickOutside` fired only once');
  });

  this.render(hbs`
    <div class="outside">Somewhere, over the rainbow...</div>

    <div class="except-outside">
      <div>
        Somewhere, under the rainbow...
      </div>
    </div>

    {{#click-outside except-selector=".except-outside" action=(action "didClickOutside")}}
    {{/click-outside}}
  `);

  // It's important to fire the actions in the next run loop. Failing to do so
  // would make the outside click not to fire. The reason for this is more
  // often than not the component is rendered as a result of some user
  // interaction, mainly a click. If the component attached the outside click
  // event handler in the same loop, the handler would catch the event and send
  // the action immediately.
  next(()=> {
    click('.outside');
    click('.except-outside div');
  });

});
