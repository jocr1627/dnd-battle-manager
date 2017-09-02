import {
  GAME_ENDED,
  ROUND_STARTED,
} from '../event/Constants';

export const gameEnded = () => {
  return {
    type: GAME_ENDED,
  };
};

export const roundStarted = () => {
  return {
    type: ROUND_STARTED,
  };
};
