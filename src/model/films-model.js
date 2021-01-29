import dayjs from 'dayjs';

import Observer from '../utils/observer';

export default class FilmsModel extends Observer {
  constructor() {
    super();

    this._films = [];
  }

  setFilms(updateType, films) {
    this._films = films.slice();

    this._notify(updateType);
  }

  getFilms() {
    return this._films;
  }

  getFilm(id) {
    return this._films.find((film) => film.id === id);
  }

  updateFilm(updateType, update) {
    const index = this._films
      .findIndex((film) => film.id === update.id);

    if (index === -1) {
      throw new Error(`Can't update nonexistent film`);
    }

    this._films = [
      ...this._films.slice(0, index),
      update,
      ...this._films.slice(index + 1)
    ];

    this._notify(updateType, update);
  }

  static adaptToServer(film) {
    return {
      'id': String(film.id),
      'comments': film.commentIds,
      'film_info': {
        'title': film.title,
        'alternative_title': film.originTitle,
        'total_rating': film.rating,
        'poster': film.poster,
        'age_rating': film.ageRating,
        'director': film.director,
        'writers': film.writers,
        'actors': film.actors,
        'release': {
          'date': film.releaseDate,
          'release_country': film.country,
        },
        'runtime': film.filmDuration,
        'genre': film.genres,
        'description': film.description,
      },
      'user_details': {
        'watchlist': film.isWatchlist,
        'already_watched': film.isWatched,
        'watching_date': film.watchingDate,
        'favorite': film.isFavorite,
      }
    };
  }


  static adaptToClient(film) {
    return {
      id: String(film.id),
      poster: film.film_info.poster,
      title: film.film_info.title,
      originTitle: film.film_info.alternative_title,
      director: film.film_info.director,
      writers: film.film_info.writers,
      actors: film.film_info.actors,
      rating: film.film_info.total_rating,
      ageRating: film.film_info.age_rating,
      releaseDate: dayjs(film.film_info.release.date),
      filmDuration: film.film_info.runtime,
      genres: film.film_info.genre,
      country: film.film_info.release.release_country,
      description: film.film_info.description,
      isWatchlist: film.user_details.watchlist,
      isWatched: film.user_details.already_watched,
      isFavorite: film.user_details.favorite,
      commentIds: film.comments,
      watchingDate: dayjs(film.user_details.watching_date)
    };
  }

}
