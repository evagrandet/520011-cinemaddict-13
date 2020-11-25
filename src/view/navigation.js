const createFiltersTemplate = (filters) => {
  let template = ``;
  filters.forEach((filter) => {
    const {name, count} = filter;
    template += (`<a href="#${name}" class="main-navigation__item main-navigation__item">${name} <span class="main-navigation__item-count">${count}</span></a>`);
  });
  return template;
};

export const createNavigationTemplate = (filters) => {
  const filtersTemplate = createFiltersTemplate(filters);
  return `<nav class="main-navigation">
    <div class="main-navigation__items">
    ${filtersTemplate}
    </div>
    <a href="#stats" class="main-navigation__additional">Stats</a>
  </nav>
`;
};
