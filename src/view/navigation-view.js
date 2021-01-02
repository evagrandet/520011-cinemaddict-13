import AbstractView from './abstract-view';
import {FilterType} from '../const';

const createFilterTemplate = (filter) => {
  const {name, count} = filter;
  const activeFilterClass = name === `ALL` ? `main-navigation__item--active` : ``;

  return `<a href="#${name}" class="main-navigation__item ${activeFilterClass}">
      ${FilterType[name]}
      <span class="main-navigation__item-count">
        ${count}
      </span>
    </a>
  `;
};

const createFiltersTemplate = (filters) => {
  return filters.map((filter) => createFilterTemplate(filter)).join(``);
};

const createNavigationTemplate = (filters) => {
  const filtersTemplate = createFiltersTemplate(filters);
  return `<nav class="main-navigation">
      <div class="main-navigation__items">
        ${filtersTemplate}
      </div>
      <a href="#stats" class="main-navigation__additional">Stats</a>
    </nav>
  `;
};

export default class NavigationView extends AbstractView {
  constructor(filters) {
    super();
    this._filters = filters;
  }

  getTemplate() {
    return createNavigationTemplate(this._filters);
  }

}
