import NPCClasses from '../character/npc';
import Player from '../character/Player';
import { sortBy } from '../CollectionUtils';
import { addEvent, resolveEvents } from '../event/Event';
import Map from '../Map';

import {
  gameEnded,
  roundStarted,
 } from './Events';

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
    const context = {
      characters: this.characters,
      map: this.map,
    };
    let round = 1;

    while (!this.isGameOver()) {
      console.log(`Beginning Round ${round}...`);

      addEvent(roundStarted());
      resolveEvents(context);

      round++;
    }

    dispatch(gameEnded());
    console.log('GAME OVER');
  }
}
