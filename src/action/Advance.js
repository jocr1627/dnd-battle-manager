import { getInput } from '../Input';

import Action from './Action';
import { validateLocationIsInRange } from './Utils';

export default class Advance extends Action {
  constructor() {
    super('Advance');
  }

  _resolve(actor, context) {
    const {
      map: {
        nodes,
      },
    } = context;
    const locationName = getInput(
      `Where did ${this.actor.displayName} advance to? `,
      false,
      (locationName) => validateLocationIsInRange(this.actor, locationName)
    );

    this.actor.move(nodes[locationName]);
  }
}
