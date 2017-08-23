import { getInput } from '../Input';

export default class Character {
  constructor(config) {
    const {
      location,
      name,
    } = config;

    this.displayName = `${name[0].toUpperCase()}${name.slice(1, name.length)}`;
    this.isAlive = true;
    this.isPC = false;
    this.name = name;

    this.move(location);
  }

  chooseTargets(numTargets, characters) {
    const targetNames = getInput(
      `${this.displayName} must choose ${numTargets} target(s): `,
      true,
      (targetNames) => {
        return {
          isValid: targetNames.every((name) => Boolean(characters[name])),
          msg: `Invalid response. Choose from the following characters: ${Object.keys(characters)} Try again: `,
        }
      }
    );

    return targetNames.map((name) => characters[name]);
  }

  die(characters) {
    console.log(`${this.displayName} was slain!`);    
    this.isAlive = false;
    delete characters[this.name];
  }

  move(newLocation) {
    if (this.location) {
      delete this.location.occupants[this.name];
    }
  
    newLocation.occupants[this.name] = this;    
    this.location = newLocation;
  }

  chooseAction(characters, nodes) {}
  getActionRank(actionName) {}
  roll(type) {}
  takeDamage(damage, characters) {}
}

