import {render, remove, RenderPosition, replace} from '../utils/render';
import {UserAction, UpdateType, KeyCode, State} from '../const';
import FilmCardView from '../view/film-card-view';
import FilmPopupView from '../view/film-popup-view';
import FilmPopupNewCommentView from '../view/film-popup-new-comment-view';
import FilmPopupCommentsView from '../view/film-popup-comments-view';
import dayjs from 'dayjs';
import {toast} from '../utils/toast';
import {isOnline} from '../utils/common';
export default class FilmPresenter {
  constructor(filmsListContainer, changeData, commentsModel, api) {
    this._filmsListContainer = filmsListContainer;
    this._changeData = changeData;
    this._commentsModel = commentsModel;
    this._api = api;

    this._filmComponent = null;
    this._filmPopupComponent = null;
    this._filmCommentsComponent = null;
    this._newCommentComponent = null;
    this._comments = [];

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
    this._getFilmComments(this._film);
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
    this._filmCommentsComponent.update(this._commentsModel.getComments(data.id));
  }

  setViewState(state, data) {
    const resetDeletedComment = () => this._filmCommentsComponent.updateData({deletedCommentId: null});
    const resetAddingComment = () => this._newCommentComponent.updateData({isAdding: false, isError: false});
    switch (state) {
      case State.ADDING:
        this._newCommentComponent.updateData({
          isAdding: true,
        });
        break;
      case State.DELETING:
        this._filmCommentsComponent.updateData({
          deletedCommentId: data.id
        });
        break;
      case State.ABORT_ADDING:
        this._newCommentComponent.shake(resetAddingComment, this._newCommentComponent.getElement());
        break;
      case State.ABORT_DELETING:
        this._filmCommentsComponent.setAbortDeletingState(resetDeletedComment, data.id);
        break;
      case State.DEFAULT:
        this._newCommentComponent.updateData({
          isAdding: false,
        });
        this._filmCommentsComponent.updateData({
          deletedCommentId: null
        });
        break;
    }
  }

  _handleOpenPopupClick() {
    this._openFilmPopup();
  }

  _handleClosePopupClick() {
    this._closeFilmPopup();
  }

  _handleFavoriteClick() {
    this._film = Object.assign(
        {},
        this._film,
        {
          isFavorite: !this._film.isFavorite
        }
    );
    this._changeData(
        UserAction.UPDATE_FILM,
        UpdateType.MINOR,
        this._film
    );
  }

  _handleWatchedClick() {
    this._film = Object.assign(
        {},
        this._film,
        {
          isWatched: !this._film.isWatched,
          watchingDate: dayjs(),
        }
    );

    this._changeData(
        UserAction.UPDATE_FILM,
        UpdateType.MINOR,
        this._film
    );
  }

  _handleWatchlistClick() {
    this._film = Object.assign(
        {},
        this._film,
        {
          isWatchlist: !this._film.isWatchlist
        }
    );

    this._changeData(
        UserAction.UPDATE_FILM,
        UpdateType.MINOR,
        this._film
    );
  }

  _handleCommentKeyDown(comment) {
    if (!isOnline()) {
      toast(`You can't add a new comment offline`);
      return;
    }
    this._changeData(
        UserAction.ADD_COMMENT,
        UpdateType.PATCH,
        {
          id: this._film.id,
          comment
        }
    );
  }

  _handleDeleteCommentClick(commentId) {
    if (!isOnline()) {
      toast(`You can't delete comment offline`);
    }

    const deletedComment = this._commentsModel.getComments(this._film.id).find((comment) => comment.id === commentId);

    this._changeData(
        UserAction.DELETE_COMMENT,
        UpdateType.PATCH,
        {
          id: this._film.id,
          comment: deletedComment,
        }
    );
  }

  _getFilmComments(film) {
    this._api.getComments(film.id)
      .then((comments) => {
        this._commentsModel.setComments(film.id, comments);
      })
      .catch(() => {
        this._commentsModel.setComments(film.id, []);
      });
  }

  _openFilmPopup() {
    this._filmPopupComponent = new FilmPopupView(this._film);
    this._comments = this._commentsModel.getComments(this._film.id);
    this._commentsModel.addObserver(this._handleModelEvent);
    const commentsContainer = this._filmPopupComponent.getElement().querySelector(`.film-details__bottom-container`);

    document.body.classList.add(`hide-overflow`);
    document.addEventListener(`keydown`, this._escKeyDownHandler);

    this._filmPopupComponent.setClosePopupClickHandler(this._handleClosePopupClick);
    this._filmPopupComponent.setFavoriteClickHandler(this._handleFavoriteClick);
    this._filmPopupComponent.setWatchedClickHandler(this._handleWatchedClick);
    this._filmPopupComponent.setWatchlistClickHandler(this._handleWatchlistClick);

    render(document.body, this._filmPopupComponent, RenderPosition.BEFOREEND);
    this._renderCommentsComponent(commentsContainer);
    this._renderNewCommentComponent(commentsContainer);
  }

  _renderCommentsComponent(container) {
    if (this._filmCommentsComponent) {
      this._filmCommentsComponent = null;
    }

    this._filmCommentsComponent = new FilmPopupCommentsView(this._comments);
    this._filmCommentsComponent.setDeleteCommentClickHandler(this._handleDeleteCommentClick);

    render(container, this._filmCommentsComponent, RenderPosition.AFTERBEGIN);
  }

  _renderNewCommentComponent(container) {
    if (this._newCommentComponent) {
      this._newCommentComponent = null;
    }
    this._newCommentComponent = new FilmPopupNewCommentView();
    this._newCommentComponent.setNewCommentKeyDownHandler(this._handleCommentKeyDown);
    render(container, this._newCommentComponent, RenderPosition.BEFOREEND);
  }

  _escKeyDownHandler(evt) {
    if (evt.key === KeyCode.ESC) {
      this._closeFilmPopup();
    }
  }

  _closeFilmPopup() {
    remove(this._filmPopupComponent);

    this._commentsModel.removeObserver(this._handleModelEvent);

    document.body.classList.remove(`hide-overflow`);
    document.removeEventListener(`keydown`, this._escKeyDownHandler);
  }

  destroy() {
    remove(this._filmComponent);
  }
}
