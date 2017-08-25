import RollTypes from '../RollTypes';

import Action from './Action';

export default class Attack extends Action {
  constructor(character, characters, nodes) {
    super('Attack', character, characters, nodes);
  }

  _prepare() {
    const targets = this.character.chooseTargets(1, this.characters);
    const attackRoll = this.character.roll(RollTypes.weaponAttack);

    this.initiative = attackRoll;
    this.payload = {
      attackRoll,
      targets,
    };
  }

  _resolve() {
    const {
      attackRoll,
      targets,
    } = this.payload;

    targets.forEach((target) => {
      if (target.isAlive) {
        const defenseRoll = target.roll(RollTypes.physicalDefense);

        if (attackRoll >= defenseRoll) {
          console.log(`${this.name} successful!`);
          
          const damage = this.character.roll(RollTypes.weaponDamage);

          target.takeDamage(damage, this.characters);
        } else {
          console.log(`${this.name} failed!`);
        }
      }
    });
  }
}
