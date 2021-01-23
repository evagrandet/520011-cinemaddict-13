import AbstractView from './abstract-view';
import {SortType} from '../const';

const createSortItemTemplate = (sortType, currentSortType) => {
  const getActiveSortClassName = (type) => type === currentSortType ? `sort__button--active` : ``;
  return `<li><a href="#" class="sort__button ${getActiveSortClassName(sortType)}" data-sort-type="${sortType}">Sort by ${sortType}</a></li>`;
};

const createAllSortItemsTemplate = (currentSortType) => {
  return Object.values(SortType).map((sortType) => createSortItemTemplate(sortType, currentSortType)).join(``);
};

const createSortTemplate = (currentSortType) => {
  const sortTemplate = createAllSortItemsTemplate(currentSortType);
  return `<ul class="sort">
    ${sortTemplate}
  </ul>`;
};

export default class SortView extends AbstractView {
  constructor(currentSortType) {
    super();

    this._currentSortType = currentSortType;

    this._sortTypeChangeHandler = this._sortTypeChangeHandler.bind(this);
  }


  setSortTypeChangeHandler(callback) {
    this._callback.sortTypeChange = callback;

    this.getElement().addEventListener(`click`, this._sortTypeChangeHandler);
  }

  getTemplate() {
    return createSortTemplate(this._currentSortType);
  }

  _sortTypeChangeHandler(evt) {
    if (evt.target.tagName !== `A`) {
      return;
    }

    evt.preventDefault();
    this._callback.sortTypeChange(evt.target.dataset.sortType);
  }

  setDefaultSortType() {
    this._currentSortType = SortType.DEFAULT;
  }

}
