import { getInput } from '../Input';

import Action from './Action';
import { validateLocationIsInRange } from './Utils';

export default class Flee extends Action {
  constructor(character, characters, nodes) {
    super('Flee', character, characters, nodes);
  }

  _resolve() {
    const locationName = getInput(
      `Where did ${this.character.displayName} flee to? `,
      false,
      (locationName) => validateLocationIsInRange(this.character, locationName)
    );

    this.character.move(this.nodes[locationName]);
  }
}
