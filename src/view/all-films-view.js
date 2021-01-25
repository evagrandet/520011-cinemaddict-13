import AbstractView from './abstract-view';

const createAllFilmsTemplate = () => {
  return `<h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>`;
};

export default class AllFilmsView extends AbstractView {

  getTemplate() {
    return createAllFilmsTemplate();
  }

}
