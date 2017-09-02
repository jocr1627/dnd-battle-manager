import {
  ACTION_PREPARED,
  ROUND_STARTED,
  TARGET_RESPONDED,
} from '../event/Constants';

const chooseAction = (character, context) => {
  const action = character.chooseAction(context);

  action.prepare(context);
};

const resolveAction = (character, context, event) => {
  const {
    payload: {
      actionName,
      actor,
      targets,
    },
  } = event;

  if (targets.indexOf(character) >= 0) {
    console.log(`${character.displayName} is performing ${actionName}`);
    
    action.respond(character, actor, context, event);
  }
};

export default {
  [ACTION_PREPARED]: resolveAction,
  [TARGET_RESPONDED]: resolveAction,  
  [ROUND_STARTED]: chooseAction,
};
