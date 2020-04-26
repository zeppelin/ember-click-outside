import { next } from '@ember/runloop';
import { click } from '@ember/test-helpers';

export const clickOutside = async (selector) => {
  await click(selector || document.body);
  return new Promise((resolve) => next(resolve));
};
