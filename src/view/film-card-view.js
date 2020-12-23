import dayjs from "dayjs";
import duration from 'dayjs/plugin/duration';
import AbstractView from './abstract-view';
import {DescriptionSymbols} from '../const';
dayjs.extend(duration);

const createFilmCardTemplate = (film) => {
  const {poster, title, rating, releaseDate, filmDuration, genres, description, isWatchlist, isWatched, isFavorite, commentIds} = film;

  const getControlClass = (property) => property ? `film-card__controls-item--active` : ``;
  const {hours, minutes} = dayjs.duration(filmDuration, `minutes`).$d;
  return `<article class="film-card">
      <h3 class="film-card__title">${title}</h3>
      <p class="film-card__rating">${rating}</p>
      <p class="film-card__info">
        <span class="film-card__year">${releaseDate.format(`YYYY`)}</span>
        <span class="film-card__duration">${hours}h ${minutes}m</span>
        <span class="film-card__genre">${genres[0]}</span>
      </p>
      <img src="./images/posters/${poster}" alt="" class="film-card__poster">
      <p class="film-card__description">${description.length > DescriptionSymbols.MAX ? `${description.substring(0, DescriptionSymbols.MAX_VISIBLE)}…` : `${description}.`}</p>
      <a class="film-card__comments">${commentIds.length} comments</a>
      <div class="film-card__controls">
        <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist ${getControlClass(isWatchlist)}" type="button">Add to watchlist</button>
        <button class="film-card__controls-item button film-card__controls-item--mark-as-watched ${getControlClass(isWatched)}" type="button">Mark as watched</button>
        <button class="film-card__controls-item button film-card__controls-item--favorite ${getControlClass(isFavorite)}" type="button">Mark as favorite</button>
      </div>
    </article>
  `;
};

export default class FilmCardView extends AbstractView {
  constructor(film) {
    super();
    this._film = film;

    this._clickHandler = this._clickHandler.bind(this);
    this._favoriteClickHandler = this._favoriteClickHandler.bind(this);
    this._watchedClickHandler = this._watchedClickHandler.bind(this);
    this._watchlistClickHandler = this._watchlistClickHandler.bind(this);

  }

  _clickHandler() {
    this._callback.click();
  }

  _favoriteClickHandler() {
    this._callback.favoriteClick();
  }

  _watchedClickHandler() {
    this._callback.watchedClick();
  }

  _watchlistClickHandler() {
    this._callback.watchlistClick();
  }

  getTemplate() {
    return createFilmCardTemplate(this._film);
  }

  setOpenPopupClickHandler(callback) {
    this._callback.click = callback;

    this.getElement()
      .querySelectorAll(`.film-card__poster, .film-card__title, .film-card__comments`)
      .forEach((element) => element.addEventListener(`click`, this._clickHandler));
  }

  setFavoriteClickHandler(callback) {
    this._callback.favoriteClick = callback;
    this.getElement().querySelector(`.film-card__controls-item--favorite`).addEventListener(`click`, this._favoriteClickHandler);
  }

  setWatchedClickHandler(callback) {
    this._callback.watchedClick = callback;
    this.getElement().querySelector(`.film-card__controls-item--mark-as-watched`).addEventListener(`click`, this._watchedClickHandler);

  }

  setWatchlistClickHandler(callback) {
    this._callback.watchlistClick = callback;
    this.getElement().querySelector(`.film-card__controls-item--add-to-watchlist`).addEventListener(`click`, this._watchlistClickHandler);
  }
}
