import { default as actionDefinitions} from '../ActionDefinitions';
import Character from './Character';
import { getInput } from '../Input';

export default class Player extends Character {
  constructor(config) {
    super(config);

    this.isPC = true;
  }

  chooseAction(characters, nodes) {
    const actionName = getInput(
      `What is ${this.displayName}'s action? `,
      false,
      (actionName) => {
        return {
          isValid: Boolean(actionDefinitions[actionName]),
          msg: `Invalid response. ${actionName} is not a known action. Try again: `,
        };
      }
    );

    return actionDefinitions[actionName].createAction(this, characters, nodes);
  }

  roll(type) {
    const response = getInput(`${this.displayName} must roll for ${type}: `);

    return parseInt(response);
  }

  takeDamage(damage, characters) {
    console.log(`${this.displayName} took ${damage} points of damage!`);
    
    const response = getInput(`Did ${this.displayName} survive (y/n)? `);

    if (response.match(/no?/)) {
      this.die(characters);
    }
  }
}
