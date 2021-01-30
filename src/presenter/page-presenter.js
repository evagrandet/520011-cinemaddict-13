import AllFilmsView from '../view/all-films-view';
import CommentedFilmsView from '../view/commented-films-view';
import NoFilmsView from '../view/no-films-view';
import RatedFilmsView from '../view/rated-films-view';
import SortView from '../view/sort-view';
import LoadMoreBtnView from '../view/load-more-btn-view';
import FilmPresenter from './film-presenter';
import {render, RenderPosition, remove, replace} from '../utils/render.js';
import {sortByDate, sortByRating, sortByCommentsCount} from '../utils/films';
import {SortType, State, UpdateType, UserAction} from '../const';
import Filters from '../utils/filters';
import LoadingView from '../view/loading-view';
import FilmsContainerView from '../view/films-container-view';
import CommonFilmsView from '../view/common-films-view';

const CardCount = {
  STEP: 5,
  EXTRA: 2
};


export default class PagePresenter {
  constructor(pageContainer, filmsModel, commentsModel, filterModel, api, profileComponent) {
    this._pageContainer = pageContainer;

    this._filmsModel = filmsModel;
    this._commentsModel = commentsModel;
    this._filterModel = filterModel;
    this._api = api;

    this._profileComponent = profileComponent;

    this._renderedFilmsCount = CardCount.STEP;
    this._sortComponent = null;
    this._loadMoreButtonComponent = null;
    this._filmPresenter = {};
    this._currentSortType = SortType.DEFAULT;
    this._isLoading = true;
    this._filmsListContainer = null;

    this._commonFilmsComponent = new CommonFilmsView();
    this._allFilmsComponent = new AllFilmsView();
    this._filmsContainerComponent = new FilmsContainerView();
    this._ratedFilmsComponent = null;
    this._commentedFilmsComponent = null;
    this._noFilmsComponent = new NoFilmsView();
    this._loadingComponent = new LoadingView();

    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
    this._handleLoadMoreButtonClick = this._handleLoadMoreButtonClick.bind(this);

    this._filmsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
  }

  init() {
    this._filmsListContainer = this._commonFilmsComponent.getElement().querySelector(`.films-list`);
    render(this._pageContainer, this._commonFilmsComponent, RenderPosition.BEFOREEND);
    this._renderPage();
  }

  _getFilms() {
    const filterType = this._filterModel.getFilter();
    const films = this._filmsModel.getFilms();
    const filteredFilms = Filters.getFilter(films, filterType);
    switch (this._currentSortType) {
      case SortType.DATE:
        return filteredFilms.sort(sortByDate);
      case SortType.RATING:
        return filteredFilms.sort(sortByRating);
    }

    return filteredFilms;
  }

  _renderSort() {
    if (this._sortComponent) {
      this._sortComponent = null;
    }

    this._sortComponent = new SortView(this._currentSortType);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
    render(this._commonFilmsComponent, this._sortComponent, RenderPosition.BEFOREBEGIN);
  }

  _renderFilmsContainer() {
    render(this._filmsListContainer, this._allFilmsComponent, RenderPosition.AFTERBEGIN);
    render(this._filmsListContainer, this._filmsContainerComponent, RenderPosition.BEFOREEND);
  }


  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._currentSortType = sortType;
    this._clearPage({resetRenderedFilmsCount: true});
    this._renderPage();
    this._renderRatedFilms();
    this._renderCommentedFilms();
  }

  _renderFilm(film, container) {
    const filmPresenter = new FilmPresenter(container, this._handleViewAction, this._handleModeChange, this._commentsModel, this._api);
    this._filmPresenter[film.id] = filmPresenter;
    filmPresenter.init(film);
    console.log(1, film, container);
    console.log(2, this._filmPresenter);
  }

  _renderFilms(films, container) {
    films.forEach((film) => this._renderFilm(film, container));
  }

  _renderNoFilms() {
    render(this._filmsListContainer, this._noFilmsComponent, RenderPosition.AFTERBEGIN);
  }

  _renderLoading() {
    render(this._filmsListContainer, this._loadingComponent, RenderPosition.AFTERBEGIN);
  }

  _handleViewAction(actionType, updateType, update) {
    switch (actionType) {
      case UserAction.UPDATE_FILM:
        this._api.updateFilm(update)
          .then((response) => this._filmsModel.updateFilm(updateType, response));
        break;

      case UserAction.ADD_COMMENT:
        this._filmPresenter[update.id].setViewState(State.ADDING);
        this._api.addComment(update)
          .then((response) => {
            this._commentsModel.addComment(updateType, response);
            this._commentsModel.setComments(response.film.id, response.comments);
            this._filmsModel.updateFilm(updateType, response.film);
            this._filmPresenter[update.id].setViewState(State.DEFAULT);
          })
          .catch(() => {
            this._filmPresenter[update.id].setViewState(State.ABORT_ADDING);
          });
        break;

      case UserAction.DELETE_COMMENT:
        this._filmPresenter[update.id].setViewState(State.DELETING, update.comment);
        this._api.deleteComment(update)
          .then(() => {
            this._commentsModel.deleteComment(updateType, update);
            this._filmsModel.updateFilm(
                updateType,
                Object.assign(
                    {},
                    this._filmsModel.getFilm(update.id),
                    {
                      commentIds: this._commentsModel.getComments(update.id).map((item) => item.id)
                    }
                )
            );
            this._filmPresenter[update.id].setViewState(State.DEFAULT);
          })
          .catch(() => {
            this._filmPresenter[update.id].setViewState(State.ABORT_DELETING, update.comment);
          });
        break;
    }
  }

  _handleModelEvent(updateType, data) {
    switch (updateType) {
      case UpdateType.PATCH:
        this._filmPresenter[data.id].init(data);
        break;
      case UpdateType.MINOR:
        this._clearPage();
        this._renderPage();
        this._profileComponent.setRank(this._filmsModel.getFilms());
        break;
      case UpdateType.MAJOR:
        this._clearPage({resetRenderedFilmsCount: true, resetSortType: true});
        this._renderPage();
        break;
      case UpdateType.INIT:
        this._isLoading = false;
        remove(this._loadingComponent);
        this._renderPage();
        this._profileComponent.setRank(this._filmsModel.getFilms());
        break;
    }
  }

  _handleModeChange() {
    Object
      .values(this._filmPresenter)
      .forEach((presenter) => presenter.setDefaultView());
  }

  _handleLoadMoreButtonClick() {
    const filmsCount = this._getFilms().length;
    const minRenderedFilmsCount = Math.min(filmsCount, this._renderedFilmsCount + CardCount.STEP);

    const films = this._getFilms().slice(this._renderedFilmsCount, minRenderedFilmsCount);

    this._renderFilms(films, this._filmsContainerComponent);
    this._renderedFilmsCount = minRenderedFilmsCount;
    if (this._renderedFilmsCount >= filmsCount) {
      remove(this._loadMoreButtonComponent);
    }

  }
  _renderLoadMoreButton() {
    if (this._loadMoreButtonComponent) {
      this._loadMoreButtonComponent = null;
    }

    this._loadMoreButtonComponent = new LoadMoreBtnView();
    this._loadMoreButtonComponent.setClickHandler(this._handleLoadMoreButtonClick);

    render(this._filmsContainerComponent, this._loadMoreButtonComponent, RenderPosition.AFTEREND);
  }


  _renderPage() {
    if (this._isLoading) {
      this._renderLoading();
      return;
    }

    const films = this._getFilms();
    const filmsCount = this._getFilms().length;
    if (filmsCount === 0) {
      this._renderNoFilms();
      return;
    }

    this._renderFilmsContainer();
    this._renderSort();
    this._renderFilms(films.slice(0, Math.min(filmsCount, this._renderedFilmsCount)), this._filmsContainerComponent);
    // this._renderRatedFilms();
    // this._renderCommentedFilms();
    if (filmsCount > this._renderedFilmsCount) {
      this._renderLoadMoreButton();
    }
  }

  _clearPage({resetRenderedFilmsCount = false, resetSortType = false} = {}) {
    const filmsCount = this._getFilms().length;

    Object
      .values(this._filmPresenter)
      .forEach((presenter) => presenter.destroy());
    this._filmPresenter = {};

    remove(this._sortComponent);
    remove(this._loadMoreButtonComponent);
    remove(this._loadingComponent);
    remove(this._noFilmsComponent);

    this._renderedFilmsCount = resetRenderedFilmsCount ? CardCount.STEP : Math.min(filmsCount, this._renderedFilmsCount);

    if (resetSortType) {
      this._currentSortType = SortType.DEFAULT;
    }
  }

  _renderCommentedFilms() {
    console.log(this._filmsModel.getFilms());

    const mostCommentedFilms = this._filmsModel.getFilms().sort(sortByCommentsCount).slice(0, CardCount.EXTRA);
    console.log(mostCommentedFilms.some((film) => film.commentIds.length !== 0));

    if (mostCommentedFilms.some((film) => film.commentIds.length !== 0)) {
      const oldMostCommentedView = this._commentedFilmsComponent;
      this._commentedFilmsComponent = new CommentedFilmsView();
      if (oldMostCommentedView) {
        replace(this._mostCommentedFilmsView, oldMostCommentedView);
      } else {
        const filmsContainer = new FilmsContainerView();
        render(this._commonFilmsComponent, this._commentedFilmsComponent, RenderPosition.BEFOREEND);
        render(this._commentedFilmsComponent, filmsContainer, RenderPosition.BEFOREEND);
        this._renderFilms(mostCommentedFilms, filmsContainer);
      }
    }
  }

  _renderRatedFilms() {
    const topRatedFilms = this._filmsModel.getFilms().sort(sortByRating).slice(0, CardCount.EXTRA);
    console.log(topRatedFilms.some((film) => film.commentIds.length !== 0));

    if (topRatedFilms.some((film) => film.commentIds.length !== 0)) {
      const oldMostCommentedView = this._ratedFilmsComponent;
      this._ratedFilmsComponent = new RatedFilmsView();
      if (oldMostCommentedView) {
        replace(this._mostCommentedFilmsView, oldMostCommentedView);
      } else {
        const filmsContainer = new FilmsContainerView();
        render(this._commonFilmsComponent, this._ratedFilmsComponent, RenderPosition.BEFOREEND);
        render(this._ratedFilmsComponent, filmsContainer, RenderPosition.BEFOREEND);
        this._renderFilms(topRatedFilms, filmsContainer);
      }
    }

  }

  hide() {
    this._sortComponent.setDefaultSortType();
    this._sortComponent.hide();
    this._commonFilmsComponent.hide();
  }

  show() {
    this._sortComponent.show();
    this._commonFilmsComponent.show();
  }
}
