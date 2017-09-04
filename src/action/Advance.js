import { getInput } from '../Input';

import Action from './Action';
import { validateLocationIsInRange } from './Utils';

export default class Advance extends Action {
  constructor(actor) {
    super('Advance', actor);
  }

  _resolve() {
    const locationName = getInput(
      `Where did ${this.actor.displayName} advance to? `,
      false,
      (locationName) => validateLocationIsInRange(this.actor, locationName)
    );

    this.actor.move(this.nodes[locationName]);
  }
}
