import AbstractView from './abstract-view';

const createStatisticsTemplate = (filmsCount) => {
  return `<section class="footer__statistics">
      <p>${filmsCount} movies inside</p>
    </section>
  `;
};

export default class StatisticsView extends AbstractView {
  constructor(filmsCount) {
    super();
    this._filmsCount = filmsCount;
  }

  getTemplate() {
    return createStatisticsTemplate(this._filmsCount);
  }

}
