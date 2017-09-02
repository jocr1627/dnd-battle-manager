import {
  ACTION_PREPARED,
} from '../event/Constants';

const compareActionPrepared = (event0, event1) => {
  const {
    payload: {
      actionData: {
        initiative: initiative0,
      },
    },
    type: type0,
  } = event0;
  const {
    payload: {
      initiative1,
    },
    type: type1,
  } = event1;

  if (type0 != type1) {
    return -1;
  }

  if (initiative0 === initiative1) {
    return 0;
  } else if (initiative0 && initiative1) {
    return (initiative0 > initiative1) ? 1 : -1;
  } else {
    return initiative0 ? 1 : -1;
  }
};

export const actionPrepared = (payload) => {
  const {
    actionData,
    actionName,
    actor,
  } = payload;

  return {
    compare: compareActionPrepared,
    payload: {
      actionData,
      actionName,
      actor,
    },
    type: ACTION_PREPARED,
  };
};
