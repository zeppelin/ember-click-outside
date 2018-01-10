/* eslint no-console: "off" */

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
