import dayjs from 'dayjs';
import Observer from '../utils/observer';

export default class CommentsModel extends Observer {
  constructor() {
    super();

    this._comments = {};
  }

  getComments(id) {
    return this._comments[id];
  }

  setComments(id, comments) {
    this._comments[id] = comments.slice();
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

  static adaptToClient(comment) {
    return {
      id: comment.id,
      author: comment.author,
      date: dayjs(comment.date),
      emoji: comment.emotion,
      text: comment.comment,
    };
  }

  static adaptToServer(comment) {
    return {
      id: comment.id,
      author: comment.author,
      date: comment.date.toISOString(),
      emotion: comment.emoji,
      comment: comment.text,
    };
  }
}
