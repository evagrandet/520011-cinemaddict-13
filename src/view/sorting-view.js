import AbstractView from './abstract-view';
import {SortType} from '../const';

const createSortingTemplate = () => {
  return `<ul class="sort">
      <li><a href="#" class="sort__button sort__button--active" data-sort-type="${SortType.DEFAULT}">Sort by default</a></li>
      <li><a href="#" class="sort__button" data-sort-type="${SortType.DATE}">Sort by date</a></li>
      <li><a href="#" class="sort__button" data-sort-type="${SortType.RATING}">Sort by rating</a></li>
    </ul>
  `;
};

export default class SortingView extends AbstractView {
  constructor() {
    super();

    this._sortTypeChangeHandler = this._sortTypeChangeHandler.bind(this);
    this._switchActiveClass = this._switchActiveClass.bind(this);
  }


  setSortTypeChangeHandler(callback) {
    this._callback.sortTypeChange = callback;

    this.getElement().addEventListener(`click`, this._sortTypeChangeHandler);
  }

  getTemplate() {
    return createSortingTemplate();
  }

  _sortTypeChangeHandler(evt) {
    if (evt.target.tagName !== `A`) {
      return;
    }

    evt.preventDefault();
    this._switchActiveClass(evt.target);
    this._callback.sortTypeChange(evt.target.dataset.sortType);
  }

  _switchActiveClass(element) {
    this._element.querySelectorAll(`.sort__button`).forEach((item) => item.classList.remove(`sort__button--active`));
    element.classList.add(`sort__button--active`);
  }

}
