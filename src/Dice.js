export function roll(range, count = 1, bonus = 0) {
  let result = 0;

  for (let i = 0; i < count; i++) {
    result += Math.floor(Math.random()*range) + 1;
  }

  return result + bonus;
}
