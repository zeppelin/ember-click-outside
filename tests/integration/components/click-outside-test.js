import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import Ember from 'ember';
const { next } = Ember.run;

moduleForComponent('click-outside', 'Integration | Component | click outside', {
  integration: true
});

test('smoke test', function(assert) {
  assert.expect(1);

  this.on('didClickOutside', function() {
    assert.ok('`didClickOutside` fired only once');
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
    this.$('.inside').click();
    this.$('.outside').click();
  });
});
