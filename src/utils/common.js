export const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

export const generateItem = (items) => {
  const randomIndex = getRandomInteger(0, items.length - 1);

  return items[randomIndex];
};

export const generateUniqueItems = (items) => {
  const randomLength = getRandomInteger(1, items.length - 1);
  const uniqueItems = [];
  for (let i = 0; i <= randomLength; i++) {
    const randomIndex = getRandomInteger(0, items.length - 1);
    uniqueItems.push(items[randomIndex]);
  }

  return Array.from(new Set(uniqueItems));
};

export const updateItem = (items, update) => {
  const index = items.findIndex((item) => item.id === update.id);

  if (index === -1) {
    return items;
  }

  return [
    ...items.slice(0, index),
    update,
    ...items.slice(index + 1)
  ];
};
