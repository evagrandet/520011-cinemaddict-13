import AbstractView from './abstract-view';

const createCommentedFilmsTemplate = () => {
  return `<section class="films-list films-list--extra">
    <h2 class="films-list__title">Most commented</h2>

    <div class="films-list__container">
    </div>
  </section>`;
};

export default class CommentedFilmsView extends AbstractView {

  getTemplate() {
    return createCommentedFilmsTemplate();
  }

}
