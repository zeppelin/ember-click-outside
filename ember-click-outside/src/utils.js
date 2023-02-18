import { matches } from './-private/matches-selector';

export function closest(element, selector) {
  if (matches(element, selector)) {
    return element;
  }

  while (element.parentNode) {
    element = element.parentNode;

    if (matches(element, selector)) {
      return element;
    }
  }
}

export const documentOrBodyContains = (element) => {
  // https://github.com/zeppelin/ember-click-outside/issues/30
  if (typeof document.contains === 'function') {
    return document.contains(element);
  } else {
    return document.body.contains(element);
  }
};

export const ios = () => {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
};
