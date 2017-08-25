import Action from './Action';
import { validateLocationIsInRange } from './Utils';

export default class Move extends Action {
  constructor(character, characters, nodes) {
    super('Move', character, characters, nodes);
  }

  _resolve() {
    const locationName = getInput(
      `Where did ${this.character.displayName} move to? `,
      false,
      (locationName) => validateLocationIsInRange(this.character, locationName),
    );

    this.character.move(this.nodes[locationName]);
  }
}
