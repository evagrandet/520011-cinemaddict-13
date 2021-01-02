import {render, remove, RenderPosition, replace} from '../utils/render';
import {ESC_KEY, UserAction, UpdateType} from '../const';
import FilmCardView from '../view/film-card-view';
import FilmPopupView from '../view/film-popup-view';
import FilmPopupNewCommentView from '../view/film-popup-new-comment-view';

const Mode = {
  CLOSED: `CLOSED`,
  OPEN: `OPEN`,
};


export default class FilmPresenter {
  constructor(filmsListContainer, changeData, changeMode) {
    this._filmsListContainer = filmsListContainer;
    this._changeData = changeData;
    this._changeMode = changeMode;

    this._filmComponent = null;
    this._filmPopupComponent = null;
    this._newCommentComponent = null;
    this._mode = Mode.CLOSED;

    this._handleOpenPopupClick = this._handleOpenPopupClick.bind(this);
    this._handleClosePopupClick = this._handleClosePopupClick.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
    this._handleWatchedClick = this._handleWatchedClick.bind(this);
    this._handleWatchlistClick = this._handleWatchlistClick.bind(this);
  }

  init(film) {
    this._film = film;

    const prevFilmCardView = this._filmComponent;
    this._filmComponent = new FilmCardView(film);
    this._filmComponent.setOpenPopupClickHandler(this._handleOpenPopupClick);
    this._filmComponent.setFavoriteClickHandler(this._handleFavoriteClick);
    this._filmComponent.setWatchedClickHandler(this._handleWatchedClick);
    this._filmComponent.setWatchlistClickHandler(this._handleWatchlistClick);

    if (prevFilmCardView) {
      replace(this._filmComponent, prevFilmCardView);
    } else {
      render(this._filmsListContainer, this._filmComponent, RenderPosition.BEFOREEND);
      return;
    }

    remove(prevFilmCardView);
  }

  setDefaultView() {
    if (this._mode !== Mode.CLOSED) {
      this._closeFilmPopup();
    }
  }

  _handleOpenPopupClick() {
    this._changeMode();
    this._openFilmPopup();
  }

  _handleClosePopupClick() {
    this._closeFilmPopup();
  }

  _handleFavoriteClick() {
    this._changeData(
        UserAction.UPDATE_FILM,
        UpdateType.MINOR,
        Object.assign(
            {},
            this._film,
            {
              isFavorite: !this._film.isFavorite
            }
        )
    );
  }

  _handleWatchedClick() {
    this._changeData(
        UserAction.UPDATE_FILM,
        UpdateType.MINOR,
        Object.assign(
            {},
            this._film,
            {
              isWatched: !this._film.isWatched
            }
        )
    );
  }

  _handleWatchlistClick() {
    this._changeData(
        UserAction.UPDATE_FILM,
        UpdateType.MINOR,
        Object.assign(
            {},
            this._film,
            {
              isWatchlist: !this._film.isWatchlist
            }
        )
    );
  }

  _openFilmPopup() {
    this._filmPopupComponent = new FilmPopupView(this._film);
    this._newCommentComponent = new FilmPopupNewCommentView();
    const commentsContainer = this._filmPopupComponent.getElement().querySelector(`.film-details__bottom-container`);

    document.body.classList.add(`hide-overflow`);

    document.addEventListener(`keydown`, this._escKeyDownHandler);

    this._filmPopupComponent.setClosePopupClickHandler(this._handleClosePopupClick);

    this._mode = Mode.OPEN;

    render(document.body, this._filmPopupComponent, RenderPosition.BEFOREEND);
    render(commentsContainer, this._newCommentComponent, RenderPosition.BEFOREEND);

    this._filmPopupComponent.setFavoriteClickHandler(this._handleFavoriteClick);

    this._filmPopupComponent.setWatchedClickHandler(this._handleWatchedClick);

    this._filmPopupComponent.setWatchlistClickHandler(this._handleWatchlistClick);
  }

  _escKeyDownHandler(evt) {
    if (evt.key === ESC_KEY) {
      this._changeMode();

      this._mode = Mode.CLOSED;
    }
  }

  _closeFilmPopup() {
    remove(this._filmPopupComponent);

    document.body.classList.remove(`hide-overflow`);
    this._mode = Mode.CLOSED;
  }

  destroy() {
    remove(this._filmComponent);
  }
}
