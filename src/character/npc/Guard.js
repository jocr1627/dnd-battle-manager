import Actions from '../../action';
import { Sword } from '../../Weapons';

import NPC from './NPC';
import { initAttributes } from './Utils';

export default class Guard extends NPC {
  static actionRanks = {
    powerattack: 1,
  };
  static attributePriorities = [
    { attribute: 'charisma', priority: 0 },
    { attribute: 'constitution', priority: 2 },
    { attribute: 'dexterity', priority: 1 },
    { attribute: 'guile', priority: 0 },
    { attribute: 'intellect', priority: 0 },
    { attribute: 'spirit', priority: 0 },
    { attribute: 'strength', priority: 3 },
    { attribute: 'willpower', priority: 0 },
  ];

  constructor(config) {
    const {
      level,
    } = config;
    const attributes = initAttributes(level, Guard.attributePriorities);

    config = {
      attributes,
      baseHealth: 15,
      baseMana: 4,
      type: 'Guard',
      weapon: new Sword(level),
      ...config,
    };

    super(config);
  }

  chooseAction(characters, nodes) {
    const isPlayerNearby = this.isPlayerNearby(characters);
    let action;
    
    if (this.mana <= 0) {
      action = new Actions.Rest(this, characters, nodes);
    } else if (isPlayerNearby) {
      const powerAttack = new Actions.PowerAttack(this, characters, nodes);

      if (this.canPerformAction(powerAttack)) {
        action = powerAttack;
      } else {
        action = new Actions.Attack(this, characters, nodes);
      }
    } else {
      action = new Actions.Advance(this, characters, nodes);
    }

    return action;
  }
}
