import FilmsModel from '../model/films-model';
import {isOnline} from '../utils/common';

const createStoreStructure = (items) => {
  return items.reduce((acc, current) => {
    return Object.assign({}, acc, {
      [current.id]: current,
    });
  }, {});
};

const getSyncedFilms = (films) => {
  return films
    .filter(({success}) => success)
    .map(({payload}) => payload.film);
};

export default class Provider {
  constructor(api, store) {
    this._api = api;
    this._store = store;
  }

  addComment(update) {
    if (isOnline()) {
      return this._api.addComment(update);
    }

    return Promise.reject(new Error(`Add comment failed`));
  }

  deleteComment(data) {
    if (isOnline()) {
      return this._api.deleteComment(data);
    }

    return Promise.reject(new Error(`Delete comment failed`));
  }

  getComments(filmId) {
    if (isOnline()) {
      return this._api.getComments(filmId);
    }

    return Promise.resolve([]);
  }

  getFilms() {
    if (isOnline()) {
      return this._api.getFilms()
        .then((films) => {
          const items = createStoreStructure(films.map(FilmsModel.adaptToServer));
          this._store.setItems(items);

          return films;
        });
    }

    const storeFilms = Object.values(this._store.getItems());

    return Promise.resolve(storeFilms.map(FilmsModel.adaptToClient));
  }

  sync() {
    if (isOnline()) {
      const storeFilms = Object.values(this._store.getItems());

      return this._api.sync(storeFilms)
        .then((response) => {
          const updatedFilms = getSyncedFilms(response.updated);
          const items = createStoreStructure([...updatedFilms]);

          this._store.setItems(items);
        });
    }

    return Promise.reject(new Error(`Sync data failed`));
  }

  updateFilm(film) {
    if (isOnline()) {
      return this._api.updateFilm(film)
        .then((updatedFilm) => {
          this._store.setItem(updatedFilm.id, FilmsModel.adaptToServer(updatedFilm));

          return updatedFilm;
        });
    }

    this._store.setItem(film.id, FilmsModel.adaptToServer(Object.assign({}, film)));

    return Promise.resolve(film);
  }
}
