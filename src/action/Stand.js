import Action from './Action';

export default class Stand extends Action {
  constructor(character, characters, nodes) {
    super('Stand', character, characters, nodes);
  }
}
