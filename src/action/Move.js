import Action from './Action';
import { validateLocationIsInRange } from './Utils';
import { getInput } from './Input.js';

export default class Move extends Action {
  constructor(actor) {
    super('Move', actor);
  }

  _resolve() {
    const locationName = getInput(
      `Where did ${this.actor.displayName} move to? `,
      false,
      (locationName) => validateLocationIsInRange(this.actor, locationName),
    );

    this.actor.move(this.nodes[locationName]);
  }
}
