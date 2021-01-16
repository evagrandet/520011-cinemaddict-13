import Observer from '../utils/observer';

export default class CommentsModel extends Observer {
  constructor() {
    super();

    this._comments = [];
  }

  getComments(filmId) {
    return this._comments[filmId];
  }

  setComments(comments) {
    this._comments = comments.slice();
  }

  addComment(updateType, update) {
    this._comments[update.id] = [update.comment, ...this._comments[update.id]];

    this._notify(updateType, update);
  }

  deleteComment(updateType, update) {
    const index = this._comments[update.id]
      .findIndex((comment) => comment.id === update.idDeleted);

    if (index === -1) {
      throw new Error(`Can't delete nonexistent comment`);
    }

    this._comments[update.id] = [
      ...this._comments[update.id].slice(0, index),
      ...this._comments[update.id].slice(index + 1)
    ];

    this._notify(updateType, update);
  }
}
