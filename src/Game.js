import NPCClasses from './character/npc';
import Player from './character/Player';
import { sortBy } from './CollectionUtils';
import Map from './Map';

export default class Game {
  constructor(rawNodes, rawEdges, playerConfigs, enemyConfigs) {
    this.map = new Map(rawNodes, rawEdges);    
    this.characters = {};

    playerConfigs.forEach((config) => {
      const location = this.map.nodes[config.location];
      const player = new Player({ ...config, location });
      
      this.characters[player.name] = player;
    });

    enemyConfigs.forEach((config) => {
      const location = this.map.nodes[config.location];
      const NPCClass = NPCClasses[config.type];
      const enemy = new NPCClass({ ...config, location });

      this.characters[enemy.name] = enemy;
    });
  }

  isGameOver() {
    const isPC = Object.values(this.characters)[0].isPC;

    return Object.values(this.characters).every((character) => character.isPC == isPC);
  }

  start() {
    let round = 1;

    while (!this.isGameOver()) {
      console.log(`Beginning Round ${round}...`);

      Object.values(this.characters).forEach((character) => character.decrementCooldowns());
      
      const actions = [];
      
      Object.values(this.characters).forEach((character) => {
        const action = character.chooseAction(this.characters, this.map.nodes);

        action.prepare();
        actions.push(action);
      });

      sortBy(actions, 'initiative', true);

      for (let i = 0; i < actions.length; i++) {
        const action = actions[i];

        action.resolve();
        
        if (this.isGameOver()) {
          break;
        }
      }

      round++;
    }

    console.log('GAME OVER');
  }
}
