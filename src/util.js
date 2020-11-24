export const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

export const generateItem = (items) => {
  const randomIndex = getRandomInteger(0, items.length - 1);

  return items[randomIndex];
};

export const generateUniqItems = (items) => {
  const randomLength = getRandomInteger(1, items.length - 1);
  const uniqItems = [];
  for (let i = 0; i <= randomLength; i++) {
    const randomIndex = getRandomInteger(0, items.length - 1);
    uniqItems.push(items[randomIndex]);
  }

  return Array.from(new Set(uniqItems));
};
