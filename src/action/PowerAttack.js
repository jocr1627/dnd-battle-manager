import RollTypes from '../RollTypes';

import Action from './Action';

export default class PowerAttack extends Action {
  constructor() {
    super('Power Attack');
  }

  getManaCost() {
    return 2;
  }

  getActionData(actor, context) {
    const {
      characters,
    } = context;
    const rank = actor.getActionRank(this.name);
    const targets = actor.chooseTargets(1, characters);
    const attackRoll = actor.roll(RollTypes.weaponAttack) + 2 * rank;
    
    return {
      attackRoll,
      initiative: attackRoll,
      rank,
      targets,
    };
  }

  _resolve(context) {
    const {
      characters,
    } = context;
    const {
      attackRoll,
      rank,
      targets,
    } = this.inputs;

    this.actor.expendMana(2);
    this.actor.setCooldown(this.name, 2);
    
    targets.forEach((target) => {
      if (target.isAlive) {
        const defenseRoll = target.roll(RollTypes.physicalDefense);
        
        if (attackRoll >= defenseRoll) {
          console.log(`${this.name} successful!`);
          
          const multiplier = (rank >= 3) ? 2 : 1.5;
          const damage = Math.ceil(multiplier * this.actor.roll(RollTypes.weaponDamage));
          
          target.takeDamage(damage, characters);
        } else {
          console.log(`${this.name} failed!`);
        }
      }
    });
  }
}
