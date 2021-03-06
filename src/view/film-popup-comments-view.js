import dayjs from 'dayjs';
import he from 'he';
import relativeTime from 'dayjs/plugin/relativeTime';
import AbstractSmartView from './abstract-smart-view';

dayjs.extend(relativeTime);

const createCommentTemplate = (comment, deletedCommentId) => {
  const {id, author, date, emoji, text} = comment;
  return `<li class="film-details__comment" data-comment-id="${id}">
      <span class="film-details__comment-emoji">
        <img src="./images/emoji/${emoji}.png" width="55" height="55" alt="emoji-${emoji}">
      </span>
      <div>
        <p class="film-details__comment-text">${he.encode(text)}</p>
        <p class="film-details__comment-info">
          <span class="film-details__comment-author">${author}</span>
          <span class="film-details__comment-day">${dayjs(date).fromNow()}</span>
          <button class="film-details__comment-delete" data-id="${id}" ${deletedCommentId === id ? `disabled` : ``}>
            ${deletedCommentId === id ? `Deleting...` : `Delete`}
          </button>
        </p>
      </div>
    </li>
  `;
};

const createCommentsTemplate = (comments, deletedCommentId) => {
  const commentsTemplate = comments.map((comment) => createCommentTemplate(comment, deletedCommentId)).join(``);

  return `<section class="film-details__comments-wrap">
    <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${comments.length}</span></h3>

      <ul class="film-details__comments-list">
        ${commentsTemplate}
      </ul>
  </section>`;
};
export default class FilmPopupCommentsView extends AbstractSmartView {
  constructor(comments) {
    super();
    this._comments = comments;
    this._deleteCommentHandler = this._deleteCommentHandler.bind(this);
    this.restoreHandlers();
  }

  getTemplate() {
    return createCommentsTemplate(this._comments, this._data.deletedCommentId);
  }

  update(comments) {
    this._comments = comments.slice();
    this.updateElement();
  }

  restoreHandlers() {
    this.setDeleteCommentClickHandler(this._callback.deleteClick);
  }

  setDeleteCommentClickHandler(callback) {
    this._callback.deleteClick = callback;

    this.getElement().querySelectorAll(`.film-details__comment-delete`).forEach((element) => element.addEventListener(`click`, this._deleteCommentHandler));
  }

  setAbortDeletingState(callback, commentId) {
    const element = this.getElement().querySelector(`[data-comment-id="` + commentId + `"]`);
    this.shake(callback, element);
  }

  _deleteCommentHandler(evt) {
    evt.preventDefault();

    const commentId = evt.target.dataset.id;

    this._callback.deleteClick(commentId);
  }
}
