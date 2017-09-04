const getIsFlanking = (actor, target) => {
  return target.actions.every((action) => {
    return action.targets.indexOf(actor) < 0;
  });
};

const flank = (event) => {
  const {
    payload,
  } = event;
  const {
    actor,
    roll,
    target,
  } = payload;

  if (getIsFlanking(actor, target)) {
    const success = request({
      previous: event,
      type: 'FLANK',
    });

    if (success) {
      return {
        ...payload,
        roll: roll + 2,
      };
    }
  }

  return payload;
};

const isAlly = (characters) => {
  return characters.reduce((isPC, character) => {
    return character.isPC == isPC;
  }, characters[0].isPC);
};

const defenseAura = (character, event) => {
  const {
    payload,
  } = event;
  const {
    actor,
    target,
  } = payload;

  if (isAlly([character, target])) {
    return {
      ...payload,
      isFlanking: false,
    };
  }

  return payload;
};

const trip = () => {

}
