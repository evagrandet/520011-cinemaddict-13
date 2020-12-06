import AbstractView from './abstract-view';

export const createShowMoreButtonTemplate = () => {
  return `<button class="films-list__show-more">Show more</button>`;
};

export default class ShowMoreBtnView extends AbstractView {

  getTemplate() {
    return createShowMoreButtonTemplate();
  }

}
