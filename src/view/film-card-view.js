import AbstractView from './abstract-view';
import {DescriptionSymbols} from '../const';

const createFilmCardTemplate = (film) => {
  const {poster, title, rating, releaseDate, duration, genres, description, isInWatchlist, isWatched, isFavorite, commentIds} = film;

  const getControlClass = (property) => property ? `film-card__controls-item--active` : ``;
  return `<article class="film-card">
      <h3 class="film-card__title">${title}</h3>
      <p class="film-card__rating">${rating}</p>
      <p class="film-card__info">
        <span class="film-card__year">${releaseDate.format(`YYYY`)}</span>
        <span class="film-card__duration">${duration}</span>
        <span class="film-card__genre">${genres[0]}</span>
      </p>
      <img src="./images/posters/${poster}" alt="" class="film-card__poster">
      <p class="film-card__description">${description.length > DescriptionSymbols.MAX ? `${description.substring(0, DescriptionSymbols.MAX_VISIBLE)}…` : `${description}.`}</p>
      <a class="film-card__comments">${commentIds.length} comments</a>
      <div class="film-card__controls">
        <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist ${getControlClass(isInWatchlist)}" type="button">Add to watchlist</button>
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
  }

  _clickHandler() {
    this._callback.click();
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
}
