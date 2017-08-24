import * as Actions from '../Actions';
import Character from './Character';
import { sortBy } from '../CollectionUtils';
import RollFns from '../RollFns';
import { Bow, Sword } from '../Weapons';

const initAttributes = (level, attributePriorities) => {
  const maxPoints = Math.max(2, Math.ceil(level/2));
  const totalAttributePoints = level + 2;
  const sum = attributePriorities.reduce((sum, { priority }) => {
    return sum + priority;
  }, 0);

  sortBy(attributePriorities, 'priority', true);

  const attributes = {
    charisma: 0,
    constitution: 0,
    dexterity: 0,
    guile: 0,
    intellect: 0,
    spirit: 0,
    strength: 0,
    willpower: 0,
  };
  let attributePointsUsed = 0;

  for (let i = 0; i < attributePriorities.length; i++) {
    const { attribute, priority } = attributePriorities[i];
    let points = Math.min(maxPoints, Math.ceil((priority/sum)*totalAttributePoints));
    
    if (attributePointsUsed + points > totalAttributePoints) {
      points = totalAttributePoints - attributePointsUsed;
    }

    attributes[attribute] = points;
    attributePointsUsed += points;

    if (attributePointsUsed >= totalAttributePoints) {
      break;
    }
  }

  return attributes;
}

class NPC extends Character {
  constructor(config) {
    super(config);

    const {
      actionRanks,
      attributes,
      baseHealth,
      baseMana,
      level,
      name,
      type,
      weapon,
    } = config;

    this.actionRanks = actionRanks || {};
    this.attributes = attributes;
    this.level = level;
    this.maxHealth = baseHealth + 2*level + 5*attributes.constitution;
    this.maxMana = baseMana + attributes.willpower;
    this.health = this.maxHealth;    
    this.mana = this.maxMana;
    this.name = name;
    this.type = type;
    this.weapon = weapon;
  }

  canPerformAction(action) {
    const actionName = action.name;
    const manaCost = action.getManaCost(this.actionRanks[actionName]);
    const canAffordMana = (this.mana >= manaCost);
    const isActionOnCooldown = this.isActionOnCooldown(actionName);

    return canAffordMana && !isActionOnCooldown;
  }

  expendMana(mana) {
    this.mana -= mana;
  }

  getActionRank(actionName) {
    return this.actionRanks[actionName] || 1;  
  }

  isTargetInRange(target, isRanged = false) {
    return isRanged ? Boolean(this.location.edges.sight[target.location.name])
      : (this.location.name == target.location.name);
  }

  isPlayerNearby(characters) {
    return Object.values(characters).some((character) => {
      return character.isPC && (this.location.name == character.location.name);
    });
  }

  restoreMana() {
    this.mana = this.maxMana;
  }

  roll(type) {
    return RollFns[type](this);
  }

  takeDamage(damage, characters) {
    this.health -= damage;

    console.log(`${this.displayName} took ${damage} points of damage! They have ${this.health}/${this.maxHealth} HP remaining.`);

    if (this.health <= 0) {
      this.die(characters);
    }
  }
}

export class Archer extends NPC {
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

  chooseAction(characters, nodes) {
    const isPlayerNearby = this.isPlayerNearby(characters);
    let action;
    
    if (this.mana <= 0) {
      action = new Actions.Rest(this, characters, nodes);
    } else if (isPlayerNearby) {
      action = new Actions.Flee(this, characters, nodes);
    } else {
      action = new Actions.Attack(this, characters, nodes);
    }

    return action;
  }
}

export class Guard extends NPC {
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
