import NPCClasses from './character/npc';
import Player from './character/Player';
import { sortBy } from './CollectionUtils';
import Map from './Map';

export default class Game {
  constructor(rawNodes, rawEdges, playerConfigs, enemyConfigs) {
    const map = new Map(rawNodes, rawEdges);
    const characters = {};
    this.context = {};
    this.context.map = map;
    this.context.characters = characters;

    playerConfigs.forEach((config) => {
      const location = map.nodes[config.location];
      const player = new Player({ ...config, location });

      characters[player.name] = player;
    });

    enemyConfigs.forEach((config) => {
      const location = map.nodes[config.location];
      const NPCClass = NPCClasses[config.type];
      const enemy = new NPCClass({ ...config, location });

      characters[enemy.name] = enemy;
    });
  }

  isGameOver() {
    const { characters } = this.context;
    const isPC = Object.values(characters)[0].isPC;

    return Object.values(characters).every((character) => character.isPC == isPC);
  }

  start() {
    let round = 1;
    const {
      characters,
    } = this.context;

    while (!this.isGameOver()) {
      console.log(`Beginning Round ${round}...`);

      Object.values(characters).forEach((character) => character.decrementCooldowns());

      const actions = [];

      Object.values(characters).forEach((character) => {
        const action = character.chooseAction(this.context);

        action.prepare(this.context);
        actions.push(action);
      });

      sortBy(actions, 'initiative', true);

      for (let i = 0; i < actions.length; i++) {
        const action = actions[i];

        action.execute(this.context);

        if (this.isGameOver()) {
          break;
        }
      }

      round++;
    }

    console.log('GAME OVER');
  }
}
