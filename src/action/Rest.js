import Action from './Action';

export default class Rest extends Action {
  constructor(character, characters, nodes) {
    super('Rest', character, characters, nodes);
  }

  _resolve() {
    this.character.restoreMana();
  }
}
