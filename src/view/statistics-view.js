import {createElement} from "../util.js";

const createStatisticsTemplate = (filmsCount) => {
  return `<section class="footer__statistics">
      <p>${filmsCount} movies inside</p>
    </section>
  `;
};

export default class StatisticsView {
  constructor(filmsCount) {
    this._element = null;
    this._filmsCount = filmsCount;
  }

  getTemplate() {
    return createStatisticsTemplate(this._filmsCount);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
