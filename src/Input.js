import readline from 'readline-sync';

export const normalizeInput = (input) => {
  return input.trim().toLowerCase();
};

const _getInput = (msg, multiValue, getIsValid) => {
  const rawResponse = readline.question(msg);
  let response;

  if (multiValue) {
    response = rawResponse.split(/\s+/).map((input) => normalizeInput(input));
  } else {
    response = normalizeInput(rawResponse);
  }

  if (!Array.isArray(response) && response.match(/q(uit)?/)) {
    process.exit(0);
  }

  const {
    isValid,
    msg: invalidMsg,
  } = getIsValid ? getIsValid(response) : { isValid: true };

  return {
    isValid,
    msg: invalidMsg,
    response,
  }
};

export const getInput = (msg, multiValue = false, getIsValid) => {
  let isValid = false, response;

  while (!isValid) {
    const result = _getInput(msg, multiValue, getIsValid);

    isValid = result.isValid;
    msg = result.msg;
    response = result.response;
  }

  return response;
};
