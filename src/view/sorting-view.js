import AbstractView from './abstract-view';
import {SortType} from '../const';

const createSortTemplate = (sortType, currentSortType) => {
  const getActiveSortingClassName = (type) => type === currentSortType ? `sort__button--active` : ``;
  return `<li><a href="#" class="sort__button ${getActiveSortingClassName(sortType)}" data-sort-type="${sortType}">Sort by ${sortType}</a></li>`;
};

const createAllSortTemplate = (currentSortType) => {
  return Object.values(SortType).map((sortType) => createSortTemplate(sortType, currentSortType)).join(``);
};

const createSortingTemplate = (currentSortType) => {
  const sortingTemplate = createAllSortTemplate(currentSortType);
  return `<ul class="sort">
    ${sortingTemplate}
  </ul>`;
};

export default class SortingView extends AbstractView {
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
    return createSortingTemplate(this._currentSortType);
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
