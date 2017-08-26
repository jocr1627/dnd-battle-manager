export default class Action {
  constructor(name, character, characters, nodes) {
    this.character = character;
    this.characters = characters;
    this.name = name;
    this.nodes = nodes;
    this.payload = {};
  }

  getManaCost() {
    return 0;
  }

  prepare() {
    console.log(`${this.character.displayName} will perform ${this.name}...`);

    this._prepare();
  }

  resolve() {
    if (this.character.isAlive) {
      let message = `${this.character.displayName} is performing ${this.name}`;
      const targets = this.payload.targets;

      if (targets) {
        if (targets.length > 0) {
          message += ' on ';

          for (let i = 0; i < targets.length - 1; i++) {
            message += `${targets[i].displayName}, `;
          }

          message += targets[targets.length - 1].displayName;
        } else {
          message += ' but failed to find a target';
        }
      }

      console.log(`${message}...`);

      this._resolve();
    }
  }

  /* eslint-disable no-unused-vars */
  _prepare() {}
  _resolve(actions) {}
  /* eslint-disable no-unused-vars */
}
