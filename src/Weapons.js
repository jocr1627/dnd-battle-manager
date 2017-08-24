import { roll } from './Dice';

class Weapon {
  constructor(name, attributeMaximums = {}, isRanged, level) {
    this.attributeMaximums = attributeMaximums;
    this.isRanged = isRanged;
    this.level = level;
    this.name = name;
  }

  static sumAttributeBonuses(attributes, character, attributeMaximums) {
    attributes = Array.isArray(attributes) ? attributes : [attributes];

    return attributes.reduce((sum, attribute) => {
      return sum + Math.min(attributeMaximums[attribute], character.attributes[attribute]);
    }, 0);
  }

  getDamage(character) {} // eslint-disable-line no-unused-vars
}

export class Bow extends Weapon {
  constructor(level) {
    const attributeMaximums = {
      dexterity: Math.floor(level / 2),
    };

    super('Bow', attributeMaximums, true, level);
  }

  getAttackBonus(character) {
    return Weapon.sumAttributeBonuses('dexterity', character, this.attributeMaximums);
  }

  getDamage() {
    return roll(6);
  }
}

export class Sword extends Weapon {
  constructor(level) {
    const attributeMaximums = {
      dexterity: Math.floor(level / 6),
      strength: Math.floor(level / 4) + 1,
    };

    super('Sword', attributeMaximums, false, level);
  }

  getAttackBonus(character) {
    return Weapon.sumAttributeBonuses(['dexterity', 'strength'], character, this.attributeMaximums);
  }

  getDamage(character) {
    return roll(6) + Weapon.sumAttributeBonuses('strength', character, this.attributeMaximums);
  }
}
