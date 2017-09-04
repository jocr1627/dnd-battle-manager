import { addEvent } from '../event/Event';

import { actionPrepared } from './Events';

export default class Action {
  constructor(name) {
    this.name = name;
  }

  getManaCost() {
    return 0;
  }

  getPreparationData() {
    return {};
  }

  getResponseData() {
    return {};
  }

  prepare(actor, context) {
    console.log(`${actor.displayName} will perform ${this.name}...`);

    const data = this.getPreparationData(actor, context);
    const payload = {
      actionName: this.name,
      actor,
      data,
    };

    addEvent(actionPrepared(payload));    
  }

  respond(target, actor, context, event) {
    if (actor.isAlive && target.isAlive) {
      console.log(`${actor.displayName} is performing ${this.name} on ${target.displayName}...`);

      const data = this.getResponseData(target, actor, context, event);
      const payload = {
        actionName: this.name,
        actor,
        data,
        target,
      };

      addEvent(targetResponded());
    }
  }

  /* eslint-disable no-unused-vars */
  _prepare(actor, context) {}
  _resolve(actor, context, event) {}
  /* eslint-disable no-unused-vars */
}
