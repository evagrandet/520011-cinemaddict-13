import AbstractView from './abstract-view';
import {MenuItem} from '../const';

const MENU_ACTIVE_CLASS = `main-navigation__item--active`;

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

    if (evt.target === statsMenuItem) {
      this._switchActiveClass(`on`, statsMenuItem);
    } else {
      this._switchActiveClass(`off`, statsMenuItem);
    }

    this._callback.menuClick(evt.target.dataset.id);
  }

  _switchActiveClass(action, statsMenuItem) {
    switch (action) {
      case `on`:
        statsMenuItem.classList.add(MENU_ACTIVE_CLASS);
        this.getElement().querySelectorAll(`.main-navigation__item`).forEach((element) => {
          element.classList.remove(MENU_ACTIVE_CLASS);
        });
        break;
      case `off`:
        statsMenuItem.classList.remove(MENU_ACTIVE_CLASS);
        break;
    }
  }


  setOnChangeHandler(callback) {
    this._callback.menuClick = callback;

    this.getElement().addEventListener(`click`, this._menuClickHandler);
  }
}
