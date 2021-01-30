import AbstractView from './abstract-view';

const createRatedFilmsTemplate = () => {
  return `<section class="films-list films-list--extra">
    <h2 class="films-list__title">Top rated</h2>
  </section>`;
};

export default class RatedFilmsView extends AbstractView {

  getTemplate() {
    return createRatedFilmsTemplate();
  }

}
