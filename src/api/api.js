import CommentsModel from '../model/comments-model';
import FilmsModel from '../model/films-model';

const Method = {
  GET: `GET`,
  PUT: `PUT`,
  POST: `POST`,
  DELETE: `DELETE`
};

const SuccessHTTPStatusRange = {
  MIN: 200,
  MAX: 299
};

const Url = {
  MOVIES: `movies`,
  COMMENTS: `comments`,
  SYNC: `movies/sync`,
};


export default class Api {
  constructor(endPoint, authorization) {
    this._endPoint = endPoint;
    this._authorization = authorization;
  }

  getFilms() {
    return this._sendRequest({url: Url.MOVIES})
      .then(Api.toJSON)
      .then((films) => films.map(FilmsModel.adaptToClient));
  }

  updateFilm(film) {
    return this._sendRequest({
      url: `${Url.MOVIES}/${film.id}`,
      method: Method.PUT,
      body: JSON.stringify(FilmsModel.adaptToServer(film)),
      headers: new Headers({"Content-Type": `application/json`})
    })
      .then(Api.toJSON)
      .then(FilmsModel.adaptToClient);
  }

  getComments(filmId) {
    return this._sendRequest({url: `${Url.COMMENTS}/${filmId}`})
      .then(Api.toJSON)
      .then((comments) => comments.map(CommentsModel.adaptToClient));
  }

  addComment(update) {
    return this._sendRequest({
      url: `${Url.COMMENTS}/${update.id}`,
      method: Method.POST,
      body: JSON.stringify(CommentsModel.adaptToServer(update.comment)),
      headers: new Headers({"Content-Type": `application/json`})
    })
      .then(Api.toJSON)
      .then((response) => {
        const comments = response.comments.map(CommentsModel.adaptToClient);
        return {
          film: FilmsModel.adaptToClient(response.movie),
          comments,
        };
      });
  }

  deleteComment(data) {
    return this._sendRequest({
      url: `${Url.COMMENTS}/${data.comment.id}`,
      method: Method.DELETE,
    });
  }

  sync(films) {
    return this._sendRequest({
      url: Url.SYNC,
      method: Method.POST,
      body: JSON.stringify(films),
      headers: new Headers({"Content-Type": `application/json`})
    })
    .then(Api.toJSON);
  }

  _sendRequest({
    url,
    method = Method.GET,
    body = null,
    headers = new Headers()
  }) {
    headers.append(`Authorization`, this._authorization);

    return fetch(`${this._endPoint}/${url}`, {method, body, headers})
      .then(Api.checkStatus)
      .catch(Api.catchError);
  }


  static checkStatus(response) {
    if (response.status < SuccessHTTPStatusRange.MIN || response.status > SuccessHTTPStatusRange.MAX) {
      throw new Error(`${response.status}: ${response.statusText}`);
    }

    return response;
  }

  static toJSON(response) {
    return response.json();
  }

  static catchError(err) {
    throw err;
  }

}
