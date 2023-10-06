import type Modifier from 'ember-modifier';

export interface ClickOutsideSignature {
  Element?: HTMLElement;
  Args: {
    Positional: [action: (event: Event) => unknown];
    Named:
      | never
      | {
          capture?: boolean;
          eventType?: keyof DocumentEventMap;
          exceptSelector?: string;
        };
  };
}

export default class ClickOutsideModifier extends Modifier<ClickOutsideSignature> {}
