import AllFilmsView from "../view/all-films-view";
import CommentedFilmsView from "../view/commented-films-view";
import NavigationView from "../view/navigation-view";
import NoFilmsView from "../view/no-films-view";
import RatedFilmsView from "../view/rated-films-view";
import SortingView from "../view/sorting-view";
import ShowMoreBtnView from "../view/show-more-btn-view";
import FilmPresenter from './film-presenter';
import {render, RenderPosition, remove} from "../utils/render.js";
import {updateItem} from '../utils/common';
import {sortByDate, sortByRating} from '../utils/films';
import {FILMS_COUNT_PER_STEP, SortType} from '../const';


export default class PagePresenter {
  constructor(pageContainer) {
    this._pageContainer = pageContainer;
    this._renderedFilmsCount = FILMS_COUNT_PER_STEP;
    this._filmsListContainer = null;
    this._filmPresenter = {};
    this._currentSortType = SortType.BY_DEFAULT;

    this._allFilmsComponent = new AllFilmsView();
    this._sortingComponent = new SortingView();
    this._navigationComponent = new NavigationView();
    this._ratedFilmsComponent = new RatedFilmsView();
    this._commentedFilmsComponent = new CommentedFilmsView();
    this._noFilmsComponent = new NoFilmsView();
    this._loadMoreButtonComponent = new ShowMoreBtnView();

    this._handleFilmChange = this._handleFilmChange.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
    this._handleLoadMoreButtonClick = this._handleLoadMoreButtonClick.bind(this);
  }

  init(pageFilms) {
    this._pageFilms = pageFilms.slice();
    this._initialPageFilms = pageFilms.slice();


    render(this._pageContainer, this._allFilmsComponent, RenderPosition.BEFOREEND);
    this._filmsListContainer = this._allFilmsComponent.getElement().querySelector(`.films-list__container`);
    this._renderPage();
  }

  _renderSorting() {
    render(this._filmsListContainer, this._sortingComponent, RenderPosition.BEFOREBEGIN);
    this._sortingComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
  }

  _sortFilms(sortType) {
    switch (sortType) {
      case SortType.BY_DATE:
        this._pageFilms.sort(sortByDate);
        break;
      case SortType.BY_RATING:
        this._pageFilms.sort(sortByRating);
        break;
      default:
        this._pageFilms = this._initialPageFilms.slice();
    }
    this._currentSortType = sortType;
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._sortFilms(sortType);
    this._clearFilmList();
    this._renderFilmsList();
  }

  _renderFilm(film) {
    const filmPresenter = new FilmPresenter(this._filmsListContainer, this._handleFilmChange, this._handleModeChange);
    this._filmPresenter[film.id] = filmPresenter;
    filmPresenter.init(film);
  }

  _renderFilms(from, to) {
    this._pageFilms
      .slice(from, to)
      .forEach((film) => this._renderFilm(film));
  }

  _renderNoFilms() {
    render(this._allFilmsComponent, this._noFilmsComponent, RenderPosition.BEFOREEND);
  }

  _handleFilmChange(updatedFilm) {
    this._pageFilms = updateItem(this._pageFilms, updatedFilm);
    this._filmPresenter[updatedFilm.id].init(updatedFilm);
  }

  _handleModeChange() {
    Object
      .values(this._filmPresenter)
      .forEach((presenter) => presenter.setDefaultView());
  }

  _handleLoadMoreButtonClick() {
    this._renderFilms(this._renderedFilmsCount, this._renderedFilmsCount + FILMS_COUNT_PER_STEP);
    this._renderedFilmsCount += FILMS_COUNT_PER_STEP;

    if (this._renderedFilmsCount >= this._pageFilms.length) {
      remove(this._loadMoreButtonComponent);
    }

  }
  _renderLoadMoreButton() {
    render(this._filmsListContainer, this._loadMoreButtonComponent, RenderPosition.AFTEREND);

    this._loadMoreButtonComponent.setClickHandler(this._handleLoadMoreButtonClick);
  }

  _renderFilmsList() {
    this._renderFilms(0, Math.min(this._pageFilms.length, FILMS_COUNT_PER_STEP));

    if (this._pageFilms.length > FILMS_COUNT_PER_STEP) {
      this._renderLoadMoreButton();
    }
  }

  _renderPage() {
    if (this._pageFilms.length === 0) {
      this._renderNoFilms();
      return;
    }

    this._renderSorting();

    this._renderFilmsList();
  }

  _clearFilmList() {
    Object
      .values(this._filmPresenter)
      .forEach((presenter) => presenter.destroy());
    this._filmPresenter = {};
    this._renderedFilmsCount = FILMS_COUNT_PER_STEP;
    remove(this._loadMoreButtonComponent);
  }

  _renderCommentedFilms() {

  }

  _renderRatedFilms() {

  }
}
