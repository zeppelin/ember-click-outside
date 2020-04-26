import { setModifierManager, capabilities } from '@ember/modifier';
import { closest, documentOrBodyContains, ios } from './utils';
import { next, cancel } from '@ember/runloop';

export default setModifierManager(
  () => ({
    capabilities: capabilities ? capabilities('3.13') : undefined,

    state: null,
    _cancelOutsideListenerSetup: null,

    createModifier(factory, args) {
      return {
        element: null,
        eventHandler: null,
        action: null,
        eventType: null,
        capture: null,
      };
    },

    installModifier(state, element, args) {
      this.state = state;

      let [action] = args.positional;
      let { exceptSelector, capture } = args.named;
      let { eventType = 'click' } = args.named;

      if (action) {
        state.action = action;
        state.element = element;
        state.eventType = eventType;
        state.eventHandler = createHandler(element, action, exceptSelector);
        state.capture = capture;

        this._cancelOutsideListenerSetup = next(this, this.addClickOutsideListener);
      }

      if (ios()) {
        document.body.style.cursor = 'pointer';
      }
    },

    updateModifier(state, args) {
      this.state = state;

      let [action] = args.positional;
      let { exceptSelector, capture } = args.named;
      let { eventType = 'click' } = args.named;

      if (state.action) {
        cancel(this._cancelOutsideListenerSetup);
        this.removeClickOutsideListener();
      }

      if (action) {
        state.action = action;
        state.eventType = eventType;
        state.eventHandler = createHandler(state.element, action, exceptSelector);
        state.capture = capture;

        next(this, this.addClickOutsideListener);
      }
    },

    destroyModifier(state, element) {
      this.state = state;

      if (state.action) {
        cancel(this._cancelOutsideListenerSetup);
        this.removeClickOutsideListener();
      }

      if (ios()) {
        document.body.style.cursor = '';
      }
    },

    addClickOutsideListener() {
      let eventType = this.state.eventType || 'click';
      let { capture, eventHandler } = this.state;

      document.addEventListener(eventType, eventHandler, { capture });
    },

    removeClickOutsideListener() {
      let eventType = this.state.eventType || 'click';
      let { capture, eventHandler } = this.state;

      document.removeEventListener(eventType, eventHandler, { capture });
    }
  }),
  class OnClickOutsideModifier {}
);

const createHandler = (element, action, exceptSelector) => (e) => {
  if (exceptSelector && closest(e.target, exceptSelector)) {
    return;
  }

  let path = e.path || (e.composedPath && e.composedPath());

  if (path) {
    path.includes(element) || action(e);
  } else {
    // Check if the click target still is in the DOM.
    // If not, there is no way to know if it was inside the element or not.
    let isRemoved = !e.target || !documentOrBodyContains(e.target);

    // Check the element is found as a parent of the click target.
    let isInside = element === e.target || element.contains(e.target);

    if (!isRemoved && !isInside) {
      action(e);
    }
  }
};
