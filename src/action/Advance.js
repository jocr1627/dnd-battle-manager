import { getInput } from '../Input';

import Action from './Action';
import { validateLocationIsInRange } from './Utils';

export default class Advance extends Action {
  constructor(character, characters, nodes) {
    super('Advance', character, characters, nodes);
  }

  _resolve() {
    const locationName = getInput(
      `Where did ${this.character.displayName} advance to? `,
      false,
      (locationName) => validateLocationIsInRange(this.character, locationName)
    );

    this.character.move(this.nodes[locationName]);
  }
}
