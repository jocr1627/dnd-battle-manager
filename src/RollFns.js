import { roll } from './Dice';
import * as RollTypes from './RollTypes';

export default {
  [RollTypes.physicalDefense]: (character) => roll(20) + character.attributes.dexterity,
  [RollTypes.weaponAttack]: (character) => roll(20) + character.weapon.getAttackBonus(character),
  [RollTypes.weaponDamage]: (character) => character.weapon.getDamage(character),
};