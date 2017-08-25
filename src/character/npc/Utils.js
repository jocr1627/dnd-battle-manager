import { sortBy } from '../../CollectionUtils';

export const initAttributes = (level, attributePriorities) => {
  const maxPoints = Math.max(2, Math.ceil(level / 2));
  const totalAttributePoints = level + 2;
  const sum = attributePriorities.reduce((sum, { priority }) => {
    return sum + priority;
  }, 0);

  sortBy(attributePriorities, 'priority', true);

  const attributes = {
    charisma: 0,
    constitution: 0,
    dexterity: 0,
    guile: 0,
    intellect: 0,
    spirit: 0,
    strength: 0,
    willpower: 0,
  };
  let attributePointsUsed = 0;

  for (let i = 0; i < attributePriorities.length; i++) {
    const { attribute, priority } = attributePriorities[i];
    let points = Math.min(maxPoints, Math.ceil((priority / sum) * totalAttributePoints));

    if (attributePointsUsed + points > totalAttributePoints) {
      points = totalAttributePoints - attributePointsUsed;
    }

    attributes[attribute] = points;
    attributePointsUsed += points;

    if (attributePointsUsed >= totalAttributePoints) {
      break;
    }
  }

  return attributes;
};
