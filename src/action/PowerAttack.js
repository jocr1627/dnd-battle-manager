import RollTypes from '../RollTypes';

import Action from './Action';

export default class PowerAttack extends Action {
  constructor(character) {
    super('Power Attack', character);
  }

  getManaCost() {
    return 2;
  }

  _prepare(context) {
    const rank = this.character.getActionRank(this.name);
    const targets = this.character.chooseTargets(1, context.characters);
    const attackRoll = this.character.roll(RollTypes.weaponAttack) + 2 * rank;

    this.initiative = attackRoll;
    this.payload = {
      attackRoll,
      rank,
      targets,
    };
  }

  _resolve(context) {
    const {
      attackRoll,
      rank,
      targets,
    } = this.payload;

    this.character.expendMana(2);
    this.character.setCooldown(this.name, 2);

    targets.forEach((target) => {
      if (target.isAlive) {
        const defenseRoll = target.roll(RollTypes.physicalDefense);

        if (attackRoll >= defenseRoll) {
          console.log(`${this.name} successful!`);

          const multiplier = (rank >= 3) ? 2 : 1.5;
          const damage = Math.ceil(multiplier * this.character.roll(RollTypes.weaponDamage));

          target.takeDamage(damage, context.characters);
        } else {
          console.log(`${this.name} failed!`);
        }
      }
    });
  }
}
