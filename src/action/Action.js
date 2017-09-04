export default class Action {
  constructor(name, actor) {
    this.actor = actor;
    this.name = name;
    this.data = {};
  }

  getManaCost() {
    return 0;
  }

  prepare(context) {
    console.log(`${this.actor.displayName} will perform ${this.name}...`);

    this._prepare(context);
  }

  execute(context) {
    if (this.actor.isAlive) {
      let message = `${this.actor.displayName} is performing ${this.name}`;
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

      this._execute(context);
    }
  }

  /* eslint-disable no-unused-vars */
  _prepare(context) {
    throw new Error('Define me, jackass!');
  }
  _execute(context) {
    throw new Error('Define me, jackass!');
  }
  /* eslint-disable no-unused-vars */
}
