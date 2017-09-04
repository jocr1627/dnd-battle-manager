
import Actions from '../../action';
import { Bow } from '../../Weapons';

import NPC from './NPC';
import { initAttributes } from './Utils';

export default class Archer extends NPC {
  static attributePriorities = [
    { attribute: 'charisma', priority: 0 },
    { attribute: 'constitution', priority: 1 },
    { attribute: 'dexterity', priority: 3 },
    { attribute: 'guile', priority: 2 },
    { attribute: 'intellect', priority: 0 },
    { attribute: 'spirit', priority: 0 },
    { attribute: 'strength', priority: 1 },
    { attribute: 'willpower', priority: 1 },
  ];

  constructor(config) {
    const {
      level,
    } = config;
    const attributes = initAttributes(level, Archer.attributePriorities);

    config = {
      attributes,
      baseHealth: 7,
      baseMana: 4,
      type: 'Archer',
      weapon: new Bow(level),
      ...config,
    };

    super(config);
  }

  chooseAction(context) {
    const { characters } = context;
    const isPlayerNearby = this.isPlayerNearby(characters);
    let action;

    if (this.mana <= 0) {
      action = new Actions.Rest(this);
    } else if (isPlayerNearby) {
      action = new Actions.Flee(this);
    } else {
      action = new Actions.Attack(this);
    }

    return action;
  }
}
