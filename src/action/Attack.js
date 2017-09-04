import RollTypes from '../RollTypes';

import Action from './Action';

export default class Attack extends Action {
  constructor(actor) {
    super('Attack', actor);
  }

  _prepare(context) {
    const targets = this.actor.chooseTargets(1, context.characters);
    const attackRoll = this.actor.roll(RollTypes.weaponAttack);

    this.initiative = attackRoll;
    this.payload = {
      attackRoll,
      targets,
    };
  }

  _resolve(context) {
    const {
      attackRoll,
      targets,
    } = this.payload;

    targets.forEach((target) => {
      if (target.isAlive) {
        const defenseRoll = target.roll(RollTypes.physicalDefense);

        if (attackRoll >= defenseRoll) {
          console.log(`${this.name} successful!`);

          const damage = this.actor.roll(RollTypes.weaponDamage);

          target.takeDamage(damage, context.characters);
        } else {
          console.log(`${this.name} failed!`);
        }
      }
    });
  }
}
