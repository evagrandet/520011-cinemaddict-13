import AbstractView from './abstract-view';

const createNoFilmsTemplate = () => {
  return `<h2 class="films-list__title">There are no movies in our database</h2>`;
};

export default class NoFilmsView extends AbstractView {

  getTemplate() {
    return createNoFilmsTemplate();
  }

}
