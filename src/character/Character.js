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
        };
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

  /* eslint-disable no-unused-vars */
  canPerformAction(actionClassRef) {
    throw new Error('Define me, jackass!');
  }
  chooseAction(context) {
    throw new Error('Define me, jackass!');
  }
  expendMana(mana) {
    throw new Error('Define me, jackass!');
  }
  getActionRank(actionName) {
    throw new Error('Define me, jackass!');
  }
  restoreMana(mana) {
    throw new Error('Define me, jackass!');
  }
  roll(type) {
    throw new Error('Define me, jackass!');
  }
  takeDamage(damage, characters) {
    throw new Error('Define me, jackass!');
  }
  /* eslint-enable no-unused-vars */
}
