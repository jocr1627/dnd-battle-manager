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
const attack = () => {
  return {
    getData: (actor, characters) => {
      const target = actor.chooseTarget();
      const isFlanking = target.isFocused(actor);
      const roll = actor.roll();
      
      return {
        isFlanking,
        roll,
        target,
      };
    },
    name: 'Attack',
  };
};
const move = () => {
  return {
    getData() {
      return {};
    },    
    name: 'Move',
  };
};

const Character = (...args) => {
  return {
    roundStarted() {},
    ...args,
  };
};

const Archer = () => {
  return Character({
    chooseAction: () => {
      return move();
    },
    name: 'Archer',
  });
};
const Goblin = () => {
  return Character({
    chooseAction: () => {
      return attack();
    },
    chooseTarget: () => {
      return archer;
    },
    name: 'Goblin',
  });
};
const Knight = () => {
  return Character({
    chooseAction: () => {
      return move();
    },
    name: 'Knight',
  });
};
const Orc = () => {
  return Character({
    chooseAction: () => {
      return move();
    },
    name: 'Orc',
  });
};
const Thief = () => {
  return Character({
    chooseAction: () => {
      return move();
    },
    name: 'Thief',
  });
};

const archer = Archer();
const goblin = Goblin();
const knight = Knight();
const orc = Orc();
const thief = Thief();

const characters = [
  archer,
  goblin,
  knight,
  orc,
  thief,
];

const callRoundStartEvents = () => {
  characters.forEach((character) => {
    character.roundStarted();
  });
};

const chooseActions = () => {
  return characters.map((character) => {
    return character.chooseAction();
  });
};

const prepareActions = () => {
  actions.forEach((action) => {
    const data = action.getData();

    
  });
};

const sortActions = (actions) => {
  sortBy(actions, 'initiative');
};

const executeActions = (actions) => {
  actions.forEach((action) => {
    action.execute();
  });
};

const executeRound = () => {
  callRoundStartEvents();

  const actions = chooseActions();

  prepareActions(actions);
  sortActions(actions);
  executeActions(actions);
};

executeRound();
