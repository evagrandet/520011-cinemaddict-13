import dayjs from "dayjs";
import relativeTime from 'dayjs/plugin/relativeTime';
import {generateComment} from '../mock/comment';
import AbstractView from "./abstract-view";

dayjs.extend(relativeTime);

const createCommentTemplate = (comment) => {
  const {author, date, emoji, text} = comment;

  return `<li class="film-details__comment">
      <span class="film-details__comment-emoji">
        <img src="./images/emoji/${emoji}.png" width="55" height="55" alt="emoji-${emoji}">
      </span>
      <div>
        <p class="film-details__comment-text">${text}</p>
        <p class="film-details__comment-info">
          <span class="film-details__comment-author">${author}</span>
          <span class="film-details__comment-day">${date.from()}</span>
          <button class="film-details__comment-delete">Delete</button>
        </p>
      </div>
    </li>
  `;
};

const createCommentsTemplate = (commentIds) => {
  const comments = new Array(commentIds.length).fill().map(generateComment);

  const commentsTemplate = comments.map((comment) => createCommentTemplate(comment)).join(``);

  return commentsTemplate;
};


const createGenresTemplate = (genres) => {
  return genres.map((genre) => `<span class="film-details__genre">${genre}</span>`).join(``);
};


const getCheckedState = (isChecked) => isChecked ? `checked` : ``;

const createFilmPopupTemplate = (film) => {
  const {poster, title, originTitle, director, writers, actors, rating, country, ageRating, releaseDate, duration, genres, description, isWatchlist, isWatched, isFavorite, commentIds} = film;
  const commentsTemplate = createCommentsTemplate(commentIds);
  const genresTemplate = createGenresTemplate(genres);
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
                  <td class="film-details__cell">${duration}</td>
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
          <section class="film-details__comments-wrap">
            <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${commentIds.length}</span></h3>

            <ul class="film-details__comments-list">
              ${commentsTemplate}
            </ul>

          </section>
      </div>
    </form>
  </section>
`;
};

export default class FilmPopupView extends AbstractView {
  constructor(film) {
    super();
    this._film = film;

    this._clickHandler = this._clickHandler.bind(this);
  }

  _clickHandler() {
    this._callback.click();
  }

  getTemplate() {
    return createFilmPopupTemplate(this._film);
  }

  setClosePopupClickHandler(callback) {
    this._callback.click = callback;

    this.getElement().querySelector(`.film-details__close-btn`).addEventListener(`click`, this._clickHandler);
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

}
