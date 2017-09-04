import { sortBy } from './CollectionUtils';

const ANTI_DEFENSE_AURA = 'ANTI_DEFENSE_AURA';
const ATTACK = 'ATTACK';
const DEFENSE_AURA = 'DEFENSE_AURA';
const MOVE = 'MOVE';
const TRIP = 'TRIP';

const Action = (props) => {
  return {
    data: {},
    execute(characters) {
      console.log(`executing ${this.type} for ${this.actor.name}`);
      this._execute(characters);
    },
    finalize() {},
    prepare(characters) {
      console.log(`preparing ${this.type} for ${this.actor.name}`);
      this._prepare(characters);
      
      request(this);

      this.finalize();
    },
    _execute() {},
    _prepare() {},
    ...props,
  };
};
const Attack = (actor) => {
  return Action({
    actor,
    finalize() {
      const {
        isFlanking,
        roll,
      } = this.data;
      let attackScore = roll;

      console.log(isFlanking);

      if (isFlanking) {
        attackScore += 2;
      }

      this.initiative = attackScore;
      this.data.attackScore = attackScore;
    },
    _execute(characters) {
      const {
        attackScore,
        isCritical,
        roll,
        target,
      } = this.data;
      const defenseScore = target.defend(this, characters);
      console.log(roll);
      if (attackScore >= defenseScore) {
        let damage = this.actor.getDamage();

        if (isCritical) {
          damage *= 2;
        }

        target.takeDamage(damage);
      }
    },
    _prepare(characters) {
      const target = this.actor.chooseTarget(characters);
      const roll = this.actor.roll();
      const isCritical = this.actor.isCritical(roll);
      const isFlanking = !target.isFocused(actor);

      this.data = {
        isCritical,
        isFlanking,
        roll,
        target,
      };

      console.log(isFlanking);
    },
    type: ATTACK,
  });
};
const Move = (actor) => {
  return Action({
    actor,
    type: MOVE,
  });
};
const Trip = (actor, instigator) => {
  return Action({
    actor,
    finalize() {
      this.data.defenseScore = this.data.roll;
    },
    instigator,
    _execute() {
      const {
        defenseScore,
      } = this.data;
      const {
        attackScore,
      } = this.instigator.data;

      if (defenseScore > attackScore) {
        console.log('trip!');
      }
    },
    _prepare() {
      const roll = this.actor.roll();

      this.data = {
        roll,
      };
    },
    type: TRIP,
  });
};

const antiDefenseAura = (character, defenseAura) => {
  console.log('checking anti defense aura');
  if ((defenseAura.type == DEFENSE_AURA)
    && (defenseAura.actor.isPC != character.isPC)) {
    console.log('applying anti defense aura');
    
    const semiActionThing = {
      actor: character,
      mutate: (defenseAura) => {
        const oldMutate = defenseAura.mutate;

        defenseAura.mutate = (attack) => {
          oldMutate(attack);
          attack.data.roll -= 1;
        };
      },
      type: ANTI_DEFENSE_AURA,
    };

    request(semiActionThing);

    return semiActionThing.mutate;
  }
};

const defenseAura = (character, action) => {
  console.log('checking defense aura');
  if ((action.type == ATTACK)
    && (action.actor.isPC != character.isPC)) {
    console.log('applying defense aura');
    
    const semiActionThing = {
      actor: character,
      mutate: (action) => {
        action.data.isFlanking = false;
        action.data.roll += 1;
      },
      type: DEFENSE_AURA,
    };

    request(semiActionThing);

    return semiActionThing.mutate;
  }
};

const Character = (props) => {
  return {
    chooseAction() {
      this.action = this._chooseAction();

      return this.action;
    },
    defend() {},
    isCritical(roll) {
      return roll == 20;
    },
    isFocused(character) {
      return this.action && (this.action.data.target === character);
    },
    respond(action) {
      console.log(`${this.name} responding to ${action.type}`);
      this.responses.forEach((response) => {
        const mutate = response(this, action);

        if (mutate) {
          mutate(action);
        }
      });
    },
    responses: [],
    roll() {
      return 0;
    },
    takeDamage(damage) {
      console.log(`${this.name} took ${damage} damage`);
    },
    _chooseAction() {},
    ...props,
  };
};
const Archer = () => {
  return Character({
    _chooseAction() {
      return Move(this);
    },
    defend(action, characters) {
      console.log('defending');
      const trip = Trip(this, action);

      trip.prepare(characters);
      trip.execute();

      return trip.data.defenseScore;
    },
    isPC: true,
    name: 'Archer',
  });
};
const Goblin = () => {
  return Character({
    _chooseAction() {
      return Attack(this);
    },
    chooseTarget(characters) {
      return characters.filter((character) => character.name == 'Archer')[0];
    },
    getDamage() {
      return 0;
    },
    isPC: false,
    name: 'Goblin',
    responses: [
      antiDefenseAura,
    ],
  });
};
const Knight = () => {
  return Character({
    _chooseAction() {
      return Move(this);
    },
    isPC: true,
    name: 'Knight',
    responses: [
      defenseAura,
    ],
  });
};

const characters = [
  Archer(),
  Goblin(),
  Knight(),
];

const request = (action) => {
  characters.forEach((character) => {
    character.respond(action);
  });
};

const actions = [];

characters.forEach((character) => {
  const action = character.chooseAction();

  action.prepare(characters);
  actions.push(action);
});
sortBy(actions, 'initiative', true);
actions.forEach((action) => {
  action.execute(characters);  
});
