import {createElement} from '../util';

const createCommentedFilmsTemplate = () => {
  return `<section class="films-list films-list--extra">
      <h2 class="films-list__title">Most commented</h2>

      <div class="films-list__container">
      </div>
    </section>
  `;
};

export default class CommentedFilmsView {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createCommentedFilmsTemplate();
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
