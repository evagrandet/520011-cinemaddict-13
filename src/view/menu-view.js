import AbstractView from './abstract-view';
import {MenuItem} from '../const';

const FILTER_ACTIVE_CLASS = `main-navigation__item--active`;
const STATS_ACTIVE_CLASS = `main-navigation__additional--active`;

const createMenuTemplate = () => {
  return `<nav class="main-navigation">
    <a href="#stats" data-id="${MenuItem.STATS}" class="main-navigation__additional">Stats</a>
  </nav>`;
};

export default class MenuView extends AbstractView {
  constructor() {
    super();

    this._menuClickHandler = this._menuClickHandler.bind(this);
  }

  getTemplate() {
    return createMenuTemplate();
  }

  _menuClickHandler(evt) {
    const statsMenuItem = this.getElement().querySelector(`.main-navigation__additional`);
    evt.preventDefault();
    if (evt.target.tagName !== `A` && evt.target.tagName !== `SPAN`) {
      return;
    }

    this._switchActiveClass(evt.target, statsMenuItem);

    this._callback.menuClick(evt.target.dataset.id);
  }

  _switchActiveClass(target, statsMenuItem) {
    const menuItems = this.getElement().querySelectorAll(`a`);
    if (target === statsMenuItem) {
      menuItems.forEach((item) => item.classList.remove(FILTER_ACTIVE_CLASS));
      target.classList.add(STATS_ACTIVE_CLASS);
    } else {
      statsMenuItem.classList.remove(STATS_ACTIVE_CLASS);
    }

  }


  setOnChangeHandler(callback) {
    this._callback.menuClick = callback;

    this.getElement().addEventListener(`click`, this._menuClickHandler);
  }
}
