import {render, remove, RenderPosition, replace} from '../utils/render';
import {UserAction, UpdateType, KeyCode} from '../const';
import FilmCardView from '../view/film-card-view';
import FilmPopupView from '../view/film-popup-view';
import FilmPopupNewCommentView from '../view/film-popup-new-comment-view';
import {FilmPopupCommentsView} from '../view/film-popup-comments-view';

const Mode = {
  CLOSED: `CLOSED`,
  OPEN: `OPEN`,
};


export default class FilmPresenter {
  constructor(filmsListContainer, changeData, changeMode, commentsModel) {
    this._filmsListContainer = filmsListContainer;
    this._changeData = changeData;
    this._changeMode = changeMode;
    this._commentsModel = commentsModel;

    this._filmComponent = null;
    this._filmPopupComponent = null;
    this._filmCommentsComponent = null;
    this._newCommentComponent = null;
    this._mode = Mode.CLOSED;

    this._handleOpenPopupClick = this._handleOpenPopupClick.bind(this);
    this._handleClosePopupClick = this._handleClosePopupClick.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
    this._handleWatchedClick = this._handleWatchedClick.bind(this);
    this._handleWatchlistClick = this._handleWatchlistClick.bind(this);
    this._handleCommentKeyDown = this._handleCommentKeyDown.bind(this);
    this._handleDeleteCommentClick = this._handleDeleteCommentClick.bind(this);

    this._handleModelEvent = this._handleModelEvent.bind(this);
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

  _handleModelEvent(updateType, data) {
    switch (updateType) {
      case UpdateType.MINOR:
        this._filmCommentsComponent.update(this._commentsModel.getComments(data.id));
        break;
    }
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

  _handleCommentKeyDown(comment) {
    const comments = this._film.commentIds;
    let commentId = 0;

    if (comments.length > 0) {
      commentId = Math.max(...comments.map((item) => item)) + 1;
    }

    comment.id = commentId;
    this._changeData(
        UserAction.ADD_COMMENT,
        UpdateType.PATCH,
        Object.assign(
            {},
            this._film,
            {
              commentIds: [...comments, commentId]
            }
        )
    );

    this._commentsModel.addComment(
        UpdateType.MINOR,
        {
          id: this._film.id,
          comment
        }
    );

  }

  _handleDeleteCommentClick(commentId) {
    const currentComments = this._commentsModel.getComments(this._film.id).slice();
    const remainingComments = currentComments.filter((comment) => comment.id !== parseInt(commentId, 10));

    this._changeData(
        UserAction.DELETE_COMMENT,
        UpdateType.MINOR,
        Object.assign(
            {},
            this._film,
            {
              comments: remainingComments
            }
        )
    );

    this._commentsModel.deleteComment(
        UpdateType.MINOR,
        {
          id: this._film.id,
          idDeleted: parseInt(commentId, 10)
        }
    );
  }

  _openFilmPopup() {
    const prevFilmPopupView = this._filmPopupComponent;
    this._comments = this._commentsModel.getComments(this._film.id);
    this._filmPopupComponent = new FilmPopupView(this._film);
    const commentsContainer = this._filmPopupComponent.getElement().querySelector(`.film-details__bottom-container`);
    this._mode = Mode.OPEN;

    this._commentsModel.addObserver(this._handleModelEvent);
    document.body.classList.add(`hide-overflow`);
    document.addEventListener(`keydown`, this._escKeyDownHandler);
    this._filmPopupComponent.setClosePopupClickHandler(this._handleClosePopupClick);

    this._filmPopupComponent.setFavoriteClickHandler(this._handleFavoriteClick);

    this._filmPopupComponent.setWatchedClickHandler(this._handleWatchedClick);

    this._filmPopupComponent.setWatchlistClickHandler(this._handleWatchlistClick);


    if (prevFilmPopupView) {
      replace(this._filmPopupComponent, prevFilmPopupView);
      remove(prevFilmPopupView);
    } else {
      render(document.body, this._filmPopupComponent, RenderPosition.BEFOREEND);
    }
    this._renderCommentsComponent(commentsContainer);
    this._renderNewCommentComponent(commentsContainer);
  }

  _renderCommentsComponent(container) {
    const prevCommentsView = this._filmCommentsComponent;
    this._filmCommentsComponent = new FilmPopupCommentsView(this._comments);
    this._filmCommentsComponent.setDeleteCommentClickHandler(this._handleDeleteCommentClick);


    if (prevCommentsView) {
      replace(this._filmCommentsComponent, prevCommentsView);
      remove(prevCommentsView);
    } else {
      render(container, this._filmCommentsComponent, RenderPosition.AFTERBEGIN);
    }
  }

  _renderNewCommentComponent(container) {
    const prevNewCommentView = this._newCommentComponent;
    this._newCommentComponent = new FilmPopupNewCommentView();
    this._newCommentComponent.setNewCommentKeyDownHandler(this._handleCommentKeyDown);


    if (prevNewCommentView) {
      replace(this._newCommentComponent, prevNewCommentView);
      remove(prevNewCommentView);
    } else {
      render(container, this._newCommentComponent, RenderPosition.BEFOREEND);
    }
  }

  _escKeyDownHandler(evt) {
    if (evt.key === KeyCode.ESC) {
      this._changeMode();

      this._mode = Mode.CLOSED;
    }
  }

  _closeFilmPopup() {
    remove(this._filmPopupComponent);
    this._commentsModel.removeObserver(this._handleModelEvent);

    document.body.classList.remove(`hide-overflow`);
    this._mode = Mode.CLOSED;
  }

  destroy() {
    remove(this._filmComponent);
  }
}
