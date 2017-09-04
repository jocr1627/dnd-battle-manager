/**
 * start
 * 
 * goblin chooses attack
 * archer chooses move
 * 
 * goblin gets flank bonus
 * knight cancels flank bonus
 * 
 * archer attempts trip
 * 
 * thief buffs trip
 * orc cancels buff
 * 
 * archer rolls for defense
 * 
 * attack is resolved 
 */

/**
 * event
 * subscriber issues handler
 */

const ATTACK = 'ATTACK';
const FLANK = 'FLANK';
const START = 'START';

const chooseAction = (subscriber) => {
  subscriber.chooseAction();
};

const handlers = {
  START: chooseAction,
};

const flank = (payload) => {
  return send({
    payload: {
      roll: roll + 2,
    },
    type: FLANK,
  });
const attackModifiers = [
  flank,
];
const attack = (payload) => {
  const flankModifier = request(flank(payload));

  send({
    payload: modifiedPayload,
    type: ATTACK,
  });
};

const archer = () => {
  return {
    chooseAction() {
      move();
    },
    handlers,
  };
};
const goblin = () => {
  return {
    chooseAction() {
      attack({
        roll: 0,
        target: archer,
      });
    },
    handlers,
  };
};
const knight = () => {
  return {
    chooseAction() {},
    handlers,
  };
};
const orc = () => {
  return {
    chooseAction() {},
    handlers,
  };
};
const thief = () => {
  return {
    chooseAction() {},
    handlers,
  };
};
const subscribers = [
  archer,
  goblin,
  knight,
  orc,
  thief,
];

const send = (event) => {
  subscribers.forEach((subscriber) => {
    subscriber.handlers[event.type](subscriber);
  });
};

const start = () => {
  send({ type: START });
};

start();
