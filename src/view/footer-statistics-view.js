import AbstractView from './abstract-view';

const createFooterStatisticsTemplate = (filmsCount) => {
  return `<section class="footer__statistics">
    <p>${filmsCount} movies inside</p>
  </section>`;
};

export default class FooterStatisticsView extends AbstractView {
  constructor(filmsCount) {
    super();
    this._filmsCount = filmsCount;
  }

  getTemplate() {
    return createFooterStatisticsTemplate(this._filmsCount);
  }

}
