import fs from 'fs';

import Game from './Game';
import { getInput } from './Input';

require('./CollectionUtils');

const battleDataPath = getInput(
  'Provide a file path to json containing battle data: ',
  false,
  (path) => {
    const doesExist = fs.existsSync(path);
    const isValid = doesExist && fs.statSync(path).isFile();

    return {
      isValid,
      msg: `Invalid file path. Try again: `,
    };
  }
);
const fileContents = fs.readFileSync(battleDataPath);
const {
  enemies,
  map,
} = JSON.parse(fileContents);
const playerNames = getInput(
  'Who is playing? ',
  true,
  (playerNames) => {
    const confirmation = getInput(`You entered ${playerNames}. Is that correct? `);

    return {
      isValid: Boolean(confirmation.match(/y(es)?/)),
      msg: 'Let\'s try again. Who is playing? ',
    };
  }
);
const players = playerNames.map((name) => {
  return { name };
});
const locationNames = map.nodes.map(({ name }) => name);

players.forEach((player) => {
  const location = getInput(
    `Where will ${player.name} start? `,
    false,
    (locationName) => {
      return {
        isValid: locationNames.indexOf(locationName) >= 0,
        msg: `Invalid response. Choose from the following locations: ${locationNames} Try again: `,
      };
    }
  );

  player.location = location;
});

const game = new Game(map.nodes, map.edges, players, enemies);

game.start();
