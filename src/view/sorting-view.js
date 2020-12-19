import AbstractView from './abstract-view';
import {SortType} from '../const';

const createSortingTemplate = () => {
  return `<ul class="sort">
      <li><a href="#" class="sort__button sort__button--active" data-sort-type="${SortType.BY_DEFAULT}">Sort by default</a></li>
      <li><a href="#" class="sort__button" data-sort-type="${SortType.BY_DATE}">Sort by date</a></li>
      <li><a href="#" class="sort__button" data-sort-type="${SortType.BY_RATING}">Sort by rating</a></li>
    </ul>
  `;
};

export default class SortingView extends AbstractView {
  constructor() {
    super();

    this._sortTypeChangeHandler = this._sortTypeChangeHandler.bind(this);
  }


  setSortTypeChangeHandler(callback) {
    this._callback.sortTypeChange = callback;
    console.log(this._sortTypeChangeHandler);

    this.getElement().addEventListener(`click`, this._sortTypeChangeHandler);
  }

  getTemplate() {
    return createSortingTemplate();
  }

  _sortTypeChangeHandler(evt) {
    console.log(123);
    if (evt.target.tagName !== `A`) {
      return;
    }

    evt.preventDefault();
    this._callback.sortTypeChange(evt.target.dataset.sortType);
  }


}
