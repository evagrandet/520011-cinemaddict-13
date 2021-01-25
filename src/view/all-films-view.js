import AbstractView from './abstract-view';

const createAllFilmsTemplate = () => {
  return `<section class="films">
  </section>`;
};

export default class AllFilmsView extends AbstractView {

  getTemplate() {
    return createAllFilmsTemplate();
  }

}
