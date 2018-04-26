/* eslint no-console: "off" */
import { matches } from './-private/matches-selector';

export function closest(element, selector) {
  while (element.parentNode) {
    element = element.parentNode;

    if (matches(element, selector)) {
      return element;
    }
  }
}

// https://github.com/mike-north/ember-deprecated/blob/master/addon/utils.js
export function printConsoleMessage(msg) {
  if (console.trace) {
    if (console.groupCollapsed) {
      console.groupCollapsed(msg);
      console.trace();
      console.groupEnd();
    } else {
      console.warn(msg);
      console.trace();
    }
  } else {
    console.warn(msg);
  }
}
