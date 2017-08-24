Object.prototype.sortBy = (object, key, reverse = false) => {
  object.sort((element0, element1) => {
    const property0 = element0[key];
    const property1 = element1[key];
    let result;
    
    if (property0 === property1) {
      result = 0;
    } else if (property0 && property1) {
      result = property0 > property1 ? 1 : -1;
    } else {
      result = property0 ? 1 : -1;
    }

    return reverse ? -result : result;
  });
};

Object.values = (object) => {
  return Object.keys(object).map((key) => object[key]);
};
