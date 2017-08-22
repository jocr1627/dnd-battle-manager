import { getInput, normalizeInput } from './Input';
import * as RollTypes from './RollTypes';

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

class ActionDefinition {
  constructor(name) {
    this.name = name;
  }

  createAction(character, characters, nodes) {
    return new Action(this, character, characters, nodes);
  }

  prepare() {}
  resolve(action) {}
}

class Action {
  constructor(definition, character, characters, nodes) {
    const {
      name,
      prepare,
      resolve,
    } = definition;

    this.character = character;
    this.characters = characters;
    this.name = name;
    this.nodes = nodes;
    this.payload = {};
    this._prepare = prepare;
    this._resolve = resolve;    
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
}

class Advance extends ActionDefinition {
  constructor() {
    super('Advance');
  }

  resolve() {
    const locationName = getInput(
      `Where did ${this.character.displayName} advance to? `,
      false,
      (locationName) => validateLocationIsInRange(this.character, locationName)
    );

    this.character.move(this.nodes[locationName]);
  }
}

class Attack extends ActionDefinition {
  constructor() {
    super('Attack');
  }

  prepare() {
    const targets = this.character.chooseTargets(1, this.characters);
    const attackRoll = this.character.roll(RollTypes.weaponAttack);
    
    this.initiative = attackRoll;
    this.payload = {
      attackRoll,
      targets,
    };
  }

  resolve() {
    const {
      attackRoll,
      targets,
    } = this.payload;
    
    targets.forEach((target) => {
      if (target.isAlive) {
        const defenseRoll = target.roll(RollTypes.physicalDefense);
        
        if (attackRoll >= defenseRoll) {
          console.log('Attack successful!');
          
          const damage = this.character.roll(RollTypes.weaponDamage);
          
          target.takeDamage(damage, this.characters);
        } else {
          console.log('Attack failed!');
        }
      }
    })
  }
}

class Flee extends ActionDefinition {
  constructor() {
    super('Flee');
  }

  resolve() {
    const locationName = getInput(
      `Where did ${this.character.displayName} flee to? `,
      false,
      (locationName) => validateLocationIsInRange(this.character, locationName)
    );

    this.character.move(this.nodes[locationName]);
  }
}


class Move extends ActionDefinition {
  constructor() {
    super('Move');
  }

  resolve() {
    const locationName = getInput(
      `Where did ${this.character.displayName} move to? `,
      false,
      (locationName) => validateLocationIsInRange(this.character, locationName),
    );

    this.character.move(this.nodes[locationName]);
  }
}

class Rest extends ActionDefinition {
  constructor() {
    super('Rest');
  }
}

class Stand extends ActionDefinition {
  constructor() {
    super('Stand');
  }
}

const actionDefinitions = [
  new Advance(),
  new Attack(),
  new Flee(),
  new Move(),
  new Rest(),
  new Stand(),
];

export default actionDefinitions.reduce((acc, actionDefinition) => {
  const normalizedName = normalizeInput(actionDefinition.name);

  acc[normalizedName] = actionDefinition;

  return acc;
}, {});
