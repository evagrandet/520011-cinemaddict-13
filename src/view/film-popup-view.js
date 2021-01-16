import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import AbstractSmartView from './abstract-smart-view';

dayjs.extend(duration);

const createGenresTemplate = (genres) => {
  return genres.map((genre) => `<span class="film-details__genre">${genre}</span>`).join(``);
};


const getCheckedState = (isChecked) => isChecked ? `checked` : ``;

const createFilmPopupTemplate = (film) => {
  const {poster, title, originTitle, director, writers, actors, rating, country, ageRating, releaseDate, filmDuration, genres, description, isWatchlist, isWatched, isFavorite} = film;
  const genresTemplate = createGenresTemplate(genres);
  const {hours, minutes} = dayjs.duration(filmDuration, `minutes`).$d;

  return `<section class="film-details">
      <form class="film-details__inner" action="" method="get">
        <div class="film-details__top-container">
          <div class="film-details__close">
            <button class="film-details__close-btn" type="button">close</button>
          </div>
          <div class="film-details__info-wrap">
            <div class="film-details__poster">
              <img class="film-details__poster-img" src="./images/posters/${poster}" alt="${title}">

              <p class="film-details__age">${ageRating}</p>
            </div>

            <div class="film-details__info">
              <div class="film-details__info-head">
                <div class="film-details__title-wrap">
                  <h3 class="film-details__title">${title}</h3>
                  <p class="film-details__title-original">Original: ${originTitle}</p>
                </div>

                <div class="film-details__rating">
                  <p class="film-details__total-rating">${rating}</p>
                </div>
              </div>

              <table class="film-details__table">
                <tr class="film-details__row">
                  <td class="film-details__term">Director</td>
                  <td class="film-details__cell">${director}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Writers</td>
                  <td class="film-details__cell">${writers}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Actors</td>
                  <td class="film-details__cell">${actors}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Release Date</td>
                  <td class="film-details__cell">${releaseDate.format(`D MMMM YYYY`)}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Runtime</td>
                  <td class="film-details__cell">${hours}h ${minutes}m</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Country</td>
                  <td class="film-details__cell">${country}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">${genres.length > 1 ? `Genres` : `Genre`}</td>
                  <td class="film-details__cell">
                    ${genresTemplate}
                  </td>
                </tr>
              </table>

              <p class="film-details__film-description">
              ${description}
              </p>
            </div>
          </div>

          <section class="film-details__controls">
            <input type="checkbox" class="film-details__control-input visually-hidden" id="watchlist" name="watchlist" ${getCheckedState(isWatchlist)}>
            <label for="watchlist" class="film-details__control-label film-details__control-label--watchlist">Add to watchlist</label>

            <input type="checkbox" class="film-details__control-input visually-hidden" id="watched" name="watched" ${getCheckedState(isWatched)}>
            <label for="watched" class="film-details__control-label film-details__control-label--watched">Already watched</label>

            <input type="checkbox" class="film-details__control-input visually-hidden" id="favorite" name="favorite" ${getCheckedState(isFavorite)}>
            <label for="favorite" class="film-details__control-label film-details__control-label--favorite">Add to favorites</label>
          </section>
        </div>

        <div class="film-details__bottom-container">

      </div>
    </form>
  </section>
`;
};

export default class FilmPopupView extends AbstractSmartView {
  constructor(film, comments) {
    super();
    this._film = film;
    this._comments = comments;
    this.restoreHandlers();
  }

  getTemplate() {
    return createFilmPopupTemplate(this._film, this._comments);
  }

  setClosePopupClickHandler(callback) {
    this.getElement().querySelector(`.film-details__close-btn`).addEventListener(`click`, callback);
  }

  setWatchlistClickHandler(callback) {
    this.getElement().querySelector(`input[name="watchlist"]`).addEventListener(`change`, callback);
  }

  setWatchedClickHandler(callback) {
    this.getElement().querySelector(`input[name="watched"]`).addEventListener(`change`, callback);
  }

  setFavoriteClickHandler(callback) {
    this.getElement().querySelector(`input[name="favorite"]`).addEventListener(`change`, callback);
  }

  setDeleteCommentClickHandler(callback) {
    this.getElement().querySelectorAll(`.film-details__comment-delete`).forEach((element) => element.addEventListener(`click`, callback));
  }

  setFormKeydownHandler(callback) {
    this.getElement().querySelector(`form`).addEventListener(`keydown`, callback);
  }


  restoreHandlers() {
    this.setClosePopupClickHandler();
    this.setFormKeydownHandler();
    this.setFavoriteClickHandler();
    this.setWatchedClickHandler();
    this.setWatchlistClickHandler();
  }

}
