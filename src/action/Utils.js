export function getActionClassNameFromInput(input) {
  return input && input.split(/\s+/).reduce((className, word) => {
    return `${className}${word[0].toUpperCase()}${word.slice(1, word.length)}`;
  }, '');
}

export const validateLocationIsInRange = (character, locationName) => {
  const currentLocation = character.location;
  const currentLocationName = currentLocation.name;
  const movementEdges = currentLocation.edges.movement;
  const isValid = (locationName == currentLocationName)
    || Boolean(movementEdges[locationName]);
  const adjacentLocations = Object.keys(movementEdges);
  const msg = `Invalid response. Choose from the following locations: ${adjacentLocations},${currentLocationName} Try again: `;

  return {
    isValid,
    msg,
  };
};
