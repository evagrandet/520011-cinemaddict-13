import AllFilmsView from '../view/all-films-view';
import CommentedFilmsView from '../view/commented-films-view';
import NoFilmsView from '../view/no-films-view';
import RatedFilmsView from '../view/rated-films-view';
import SortingView from '../view/sorting-view';
import LoadMoreBtnView from '../view/load-more-btn-view';
import FilmPresenter from './film-presenter';
import {render, RenderPosition, remove} from '../utils/render.js';
import {sortByDate, sortByRating} from '../utils/films';
import {FILMS_COUNT_PER_STEP, SortType, UpdateType, UserAction} from '../const';


export default class PagePresenter {
  constructor(pageContainer, filmsModel, commentsModel, filterModel) {
    this._pageContainer = pageContainer;

    this._filmsModel = filmsModel;
    this._commentsModel = commentsModel;
    this._filterModel = filterModel;

    this._renderedFilmsCount = FILMS_COUNT_PER_STEP;
    this._filmsListContainer = null;
    this._sortingComponent = null;
    this._loadMoreButtonComponent = null;
    this._filmPresenter = {};
    this._currentSortType = SortType.DEFAULT;

    this._allFilmsComponent = new AllFilmsView();
    this._ratedFilmsComponent = new RatedFilmsView();
    this._commentedFilmsComponent = new CommentedFilmsView();
    this._noFilmsComponent = new NoFilmsView();

    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
    this._handleLoadMoreButtonClick = this._handleLoadMoreButtonClick.bind(this);

    this._filmsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
  }

  init() {
    render(this._pageContainer, this._allFilmsComponent, RenderPosition.BEFOREEND);
    this._filmsListContainer = this._allFilmsComponent.getElement().querySelector(`.films-list__container`);
    this._renderPage();
  }

  _getFilms() {
    switch (this._currentSortType) {
      case SortType.DATE:
        return this._filmsModel.getFilms().slice().sort(sortByDate);
      case SortType.RATING:
        return this._filmsModel.getFilms().slice().sort(sortByRating);
    }

    return this._filmsModel.getFilms();
  }

  _renderSorting() {
    if (this._sortingComponent !== null) {
      this._sortingComponent = null;
    }

    this._sortingComponent = new SortingView(this._currentSortType);
    this._sortingComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
    render(this._filmsListContainer, this._sortingComponent, RenderPosition.BEFOREBEGIN);
  }


  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._currentSortType = sortType;
    this._clearPage({resetRenderedFilmsCount: true});
    this._renderPage();
  }

  _renderFilm(film) {
    const filmPresenter = new FilmPresenter(this._filmsListContainer, this._handleViewAction, this._handleModeChange, this._commentsModel);
    this._filmPresenter[film.id] = filmPresenter;
    filmPresenter.init(film);
  }

  _renderFilms(films) {
    films.forEach((film) => this._renderFilm(film));
  }

  _renderNoFilms() {
    render(this._allFilmsComponent, this._noFilmsComponent, RenderPosition.BEFOREEND);
  }

  _handleViewAction(actionType, updateType, update) {
    switch (actionType) {
      case UserAction.UPDATE_FILM:
        this._filmsModel.updateFilm(updateType, update);
        break;
      case UserAction.ADD_COMMENT:
        this._filmsModel.updateFilm(updateType, update);
        break;
      case UserAction.DELETE_COMMENT:
        this._filmsModel.updateFilm(updateType, update);
    }
  }

  _handleModelEvent(updateType, data) {
    switch (updateType) {
      case UpdateType.PATCH:
        // - обновить часть фильма (например, когда произошло действие с комментарием)
        this._filmPresenter[data.id].init(data);
        break;
      case UpdateType.MINOR:
        // - обновить список (например, когда фильм отметили просмотренным/фав/маст вотч)
        this._clearPage();
        this._renderPage();
        break;
      case UpdateType.MAJOR:
        // - обновить всю страницу (например, при переключении фильтра)
        this._clearPage({resetRenderedFilmsCount: true, resetSortType: true});
        this._renderPage();
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
    const minRenderedFilmsCount = Math.min(filmsCount, this._renderedFilmsCount + FILMS_COUNT_PER_STEP);

    const films = this._getFilms().slice(this._renderedFilmsCount, minRenderedFilmsCount);

    this._renderFilms(films);
    this._renderedFilmsCount = minRenderedFilmsCount;
    if (this._renderedFilmsCount >= filmsCount) {
      remove(this._loadMoreButtonComponent);
    }

  }
  _renderLoadMoreButton() {
    if (this._loadMoreButtonComponent !== null) {
      this._loadMoreButtonComponent = null;
    }

    this._loadMoreButtonComponent = new LoadMoreBtnView();
    this._loadMoreButtonComponent.setClickHandler(this._handleLoadMoreButtonClick);

    render(this._filmsListContainer, this._loadMoreButtonComponent, RenderPosition.AFTEREND);
  }

  _renderPage() {
    const films = this._getFilms();
    const filmsCount = this._getFilms().length;

    if (filmsCount === 0) {
      this._renderNoFilms();
      return;
    }

    this._renderSorting();
    this._renderFilms(films.slice(0, Math.min(filmsCount, this._renderedFilmsCount)));

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

    remove(this._sortingComponent);
    remove(this._loadMoreButtonComponent);
    remove(this._noFilmsComponent);

    if (resetRenderedFilmsCount) {
      this._renderedFilmsCount = FILMS_COUNT_PER_STEP;
    } else {
      this._renderedFilmsCount = Math.min(filmsCount, this._renderedFilmsCount);
    }

    if (resetSortType) {
      this._currentSortType = SortType.DEFAULT;
    }
  }

  _renderCommentedFilms() {

  }

  _renderRatedFilms() {

  }
}
