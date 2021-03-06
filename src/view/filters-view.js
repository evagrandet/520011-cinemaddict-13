import AbstractView from './abstract-view';
import {FilterType, MenuItem} from '../const';


const createFilterTemplate = (filter, currentFilterType) => {
  const {type, name, count} = filter;

  const filterCount = type !== FilterType.ALL ? `<span class="main-navigation__item-count">${count}</span>` : ``;

  const activeFilterClassName = type === currentFilterType ? `main-navigation__item--active` : ``;

  return `<a data-id="${MenuItem.FILMS}" href="#${name}" class="main-navigation__item ${activeFilterClassName}" data-filter="${type}">${name === FilterType.ALL ? `All movies` : name} ${filterCount}</a>`;
};

const createFiltersTemplate = (filters, currentFilterType) => {
  return filters.map((filter) => createFilterTemplate(filter, currentFilterType)).join(``);
};

const createFiltersSectionTemplate = (filters, currentFilterType) => {
  const filtersTemplate = createFiltersTemplate(filters, currentFilterType);
  return `<div class="main-navigation__items">
    ${filtersTemplate}
  </div>`;
};

export default class FiltersView extends AbstractView {
  constructor(filters, currentFilterType) {
    super();
    this._filters = filters;

    this._currentFilterType = currentFilterType;

    this._filterTypeChangeHandler = this._filterTypeChangeHandler.bind(this);
  }

  _filterTypeChangeHandler(evt) {
    evt.preventDefault();

    this._callback.filterTypeChange(evt.target.dataset.filter);
  }

  getTemplate() {
    return createFiltersSectionTemplate(this._filters, this._currentFilterType);
  }

  setFilterTypeChangeHandler(callback) {
    this._callback.filterTypeChange = callback;

    this.getElement().querySelectorAll(`.main-navigation__item`).forEach((element) => element.addEventListener(`click`, this._filterTypeChangeHandler))
    ;
  }
}
