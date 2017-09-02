const handlers = {};
const priorityQueue = [];

export const addEvent = (event) => {
  const {
    compare = () => 0,
    type,
  } = event;

  if (!event.payload) {
    event.payload = {};
  }
  
  let isIndexFound = false;
  let index = 0;

  while (!isIndexFound && index < priorityQueue.length) {
    const queuedEvent = priorityQueue[index];

    if (compare(event, queuedEvent) <= 0) {
      isIndexFound = true;
    } else {
      index++;
    }
  }

  priorityQueue.splice(index, 0, event);
};

export const resolveEvents = (context) => {
  while (priorityQueue.length > 0) {
    const event = priorityQueue.pop();
    console.log(event);
    const eventHandlers = handlers[event.type];

    if (eventHandlers) {
      eventHandlers.forEach((handler) => {
        handler(context, event);
      });
    }
  }
};

export const subscribe = (subscriber, subscriberHandlers) => {
  Object.keys(subscriberHandlers).forEach((type) => {
    if (!handlers[type]) {
      handlers[type] = [];
    }

    handlers[type].push((...args) => subscriberHandlers[type](subscriber, ...args));
  });
};
