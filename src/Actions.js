import { getInput } from './Input';
import * as RollTypes from './RollTypes';

export function getActionClassNameFromInput(input) {
  return input.split(/\s+/).reduce((className, word) => {
    return `${className}${word[0].toUpperCase()}${word.slice(1, word.length)}`;
  }, '');
}

const validateLocationIsInRange = (character, locationName) => {
  const currentLocation = character.location;
  const currentLocationName = currentLocation.name;
  const movementEdges = currentLocation.edges.movement;
  const isValid = (locationName == currentLocationName)
    || Boolean(movementEdges[locationName]);
  const adjacentLocations = Object.keys(movementEdges);
  const msg = `Invalid response. Choose from the following locations: ${adjacentLocations},${currentLocationName} Try again: `;

  return {
    isValid,
    msg,
  };
};

class Action {
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
            message += `${targets[i].displayName},`;
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

  _prepare() {}
  _resolve() {}
}

export class Advance extends Action {
  constructor(character, characters, nodes) {
    super('Advance', character, characters, nodes);
  }

  _resolve() {
    const locationName = getInput(
      `Where did ${this.character.displayName} advance to? `,
      false,
      (locationName) => validateLocationIsInRange(this.character, locationName)
    );

    this.character.move(this.nodes[locationName]);
  }
}

export class Attack extends Action {
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

export class Flee extends Action {
  constructor(character, characters, nodes) {
    super('Flee', character, characters, nodes);
  }

  _resolve() {
    const locationName = getInput(
      `Where did ${this.character.displayName} flee to? `,
      false,
      (locationName) => validateLocationIsInRange(this.character, locationName)
    );

    this.character.move(this.nodes[locationName]);
  }
}


export class Move extends Action {
  constructor(character, characters, nodes) {
    super('Move', character, characters, nodes);
  }

  _resolve() {
    const locationName = getInput(
      `Where did ${this.character.displayName} move to? `,
      false,
      (locationName) => validateLocationIsInRange(this.character, locationName),
    );

    this.character.move(this.nodes[locationName]);
  }
}

export class PowerAttack extends Action {
  constructor(character, characters, nodes) {
    super('Power Attack', character, characters, nodes);
  }

  getManaCost() {
    return 2;
  }

  _prepare() {
    const rank = this.character.getActionRank(this.name);
    const targets = this.character.chooseTargets(1, this.characters);
    const attackRoll = this.character.roll(RollTypes.weaponAttack) + 2 * rank;
    
    this.initiative = attackRoll;
    this.payload = {
      attackRoll,
      rank,
      targets,
    };
  }

  _resolve() {
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
          
          target.takeDamage(damage, this.characters);
        } else {
          console.log(`${this.name} failed!`);
        }
      }
    });
  }
}

export class Rest extends Action {
  constructor(character, characters, nodes) {
    super('Rest', character, characters, nodes);
  }

  _resolve() {
    this.character.restoreMana();
  }
}

export class Stand extends Action {
  constructor(character, characters, nodes) {
    super('Stand', character, characters, nodes);
  }
}
