import { getInput } from '../Input';

import Action from './Action';
import { validateLocationIsInRange } from './Utils';

export default class Flee extends Action {
  constructor(actor) {
    super('Flee', actor);
  }

  _resolve() {
    const locationName = getInput(
      `Where did ${this.actor.displayName} flee to? `,
      false,
      (locationName) => validateLocationIsInRange(this.actor, locationName)
    );

    this.actor.move(this.nodes[locationName]);
  }
}
