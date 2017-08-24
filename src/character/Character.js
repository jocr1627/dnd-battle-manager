import { getInput } from '../Input';

export default class Character {
  constructor(config) {
    const {
      location,
      name,
    } = config;

    this.cooldowns = {};
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
  
  decrementCooldowns() {
    Object.keys(this.cooldowns).forEach((key) => {
      if (this.cooldowns[key] <= 1) {
        delete this.cooldowns[key];
      } else {
        this.cooldowns[key]--;
      }
    });
  }

  die(characters) {
    console.log(`${this.displayName} was slain!`);    
    this.isAlive = false;
    delete characters[this.name];
  }

  isActionOnCooldown(actionName) {
    return Boolean(this.cooldowns[actionName]);
  }

  move(newLocation) {
    if (this.location) {
      delete this.location.occupants[this.name];
    }
  
    newLocation.occupants[this.name] = this;    
    this.location = newLocation;
  }

  setCooldown(actionName, cooldown) {
    this.cooldowns[actionName] = cooldown;
  }
  
  canPerformAction(actionClassRef) {}
  chooseAction(characters, nodes) {}
  expendMana(mana) {}
  getActionRank(actionName) {}
  restoreMana(mana) {}
  roll(type) {}
  takeDamage(damage, characters) {}
}

