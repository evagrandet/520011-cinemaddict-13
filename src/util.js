export const RenderPosition = {
  AFTERBEGIN: `afterbegin`,
  BEFOREEND: `beforeend`,
  AFTEREND: `afterend`,
};

export const render = (container, element, place) => {
  switch (place) {
    case RenderPosition.AFTERBEGIN:
      container.prepend(element);
      break;
    case RenderPosition.BEFOREEND:
      container.append(element);
      break;
    case RenderPosition.AFTEREND:
      container.after(element);
      break;
  }
};

export const renderTemplate = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};


export const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;

  return newElement.firstChild;
};

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
