import RollFns from '../../RollFns';

import Character from '../Character';

export default class NPC extends Character {
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
    this.maxHealth = baseHealth + 2 * level + 5 * attributes.constitution;
    this.maxMana = baseMana + attributes.willpower;
    this.health = this.maxHealth;
    this.mana = this.maxMana;
    this.name = name;
    this.type = type;
    this.weapon = weapon;
  }

  canPerformAction(action) {
    const actionName = action.name;
    const manaCost = action.getManaCost(this.getActionRank(actionName));
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
    return isRanged ? (
      Boolean(this.location.edges.sight[target.location.name])
    ) : (this.location.name == target.location.name);
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
