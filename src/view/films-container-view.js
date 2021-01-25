import AbstractView from './abstract-view';


const createFilmsContainerTemplate = () => {
  return `<div class="films-list__container"></div>`;
};
export default class FilmsContainerView extends AbstractView {
  getTemplate() {
    return createFilmsContainerTemplate();
  }
}
