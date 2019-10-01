import { setModifierManager } from '@ember/modifier';
import { closest, documentOrBodyContains, ios } from './utils';

export default setModifierManager(
  () => ({
    createModifier(factory, args) {
      return {
        element: null,
        eventHandler: null,
        action: null,
        eventType: null,
      };
    },

    installModifier(state, element, args) {
      let [action] = args.positional;
      let { exceptSelector } = args.named;
      let { eventType = 'click' } = args.named;

      if (action) {
        state.action = action;
        state.element = element;
        state.eventType = eventType;
        state.eventHandler = createHandler(element, action, exceptSelector);

        document.addEventListener(eventType, state.eventHandler);
      }

      if (ios()) {
        document.body.style.cursor = 'pointer';
      }
    },

    updateModifier(state, args) {
      let [action] = args.positional;
      let { exceptSelector } = args.named;
      let { eventType = 'click' } = args.named;

      if (state.action) {
        document.removeEventListener('click', state.eventHandler);
      }

      if (action) {
        state.action = action;
        state.eventType = eventType;
        state.eventHandler = createHandler(state.element, action, exceptSelector);

        document.addEventListener(eventType, state.eventHandler);
      }
    },

    destroyModifier(state, element) {
      if (state.action) {
        document.removeEventListener(state.eventType, state.eventHandler);
      }

      if (ios()) {
        document.body.style.cursor = '';
      }
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
