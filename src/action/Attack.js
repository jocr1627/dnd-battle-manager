import { roll } from '../Dice';
import RollTypes from '../RollTypes';

import Action from './Action';

export default class Attack extends Action {
  constructor() {
    super('Attack');
  }

  getPreparationData(actor, context) {
    const {
      characters,
    } = context;
    const targets = actor.chooseTargets(1, characters);
    const attackRoll = roll(20);
    const attackBonus = actor.getBonus(RollTypes.weaponAttack);
    const attackScore = attackRoll + attackBonus;
    const range = actor.getWeaponRange();    
    
    return {
      attackBonus,
      attackRoll,
      attackScore,
      initiative: attackScore,
      range,
      targets,
    };
  }

  getResponseData(target, actor, context, event) {
    const defenseRoll = target.roll(RollTypes.physicalDefense);
    
    return {
      defenseRoll,
    };
    //   if (attackRoll >= defenseRoll) {
    //     console.log(`${this.name} successful!`);
        
    //     const damage = this.actor.roll(RollTypes.weaponDamage);

    //     target.takeDamage(damage, characters);
    //   } else {
    //     console.log(`${this.name} failed!`);
    //   }
    // }
  }
}
