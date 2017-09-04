import Action from './Action';

export default class Rest extends Action {
  constructor(actor) {
    super('Rest', actor);
  }

  _resolve() {
    this.actor.restoreMana();
  }
}
