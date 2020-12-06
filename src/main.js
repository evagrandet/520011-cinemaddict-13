import AllFilmsView from './view/all-films-view';
import CommentedFilmsView from './view/commented-films-view';
import FilmCardView from './view/film-card-view';
import FilmPopupView from './view/film-popup-view';
import NavigationView from './view/navigation-view';
import ProfileView from './view/profile-view';
import RatedFilmsView from './view/rated-films-view';
import ShowMoreBtnView from './view/show-more-btn-view';
import SortingView from './view/sorting-view';
import StatisticsView from './view/statistics-view';
import NoFilmsView from './view/no-films-view';

import {generateFilm} from './mock/film';
import {generateFilter} from './mock/filter';
import {render, RenderPosition, remove} from './utils/render';
import {ESC_KEY} from './const';

const FILMS_COUNT = 20;
const FILMS_COUNT_PER_STEP = 5;
const EXTRA_FILMS_COUNT = 2;

const films = new Array(FILMS_COUNT).fill().map(generateFilm);
const filters = generateFilter(films);

const bodyElement = document.querySelector(`body`);
const headerElement = bodyElement.querySelector(`.header`);
const mainElement = bodyElement.querySelector(`.main`);
const footerElement = bodyElement.querySelector(`.footer`);

render(headerElement, new ProfileView(), RenderPosition.BEFOREEND);
render(mainElement, new NavigationView(filters), RenderPosition.AFTERBEGIN);
render(mainElement, new SortingView(), RenderPosition.BEFOREEND);


const renderFilm = (filmsContainer, film) => {
  const filmComponent = new FilmCardView(film);

  render(filmsContainer, filmComponent, RenderPosition.BEFOREEND);


  const openFilmPopup = () => {
    const filmPopupComponent = new FilmPopupView(film);

    bodyElement.classList.add(`hide-overflow`);

    render(footerElement, filmPopupComponent, RenderPosition.AFTEREND);

    document.addEventListener(`keydown`, (evt) => {
      evt.preventDefault();
      if (evt.key === ESC_KEY) {
        closeFilmPopup();
      }
    });

    const closeFilmPopup = () => {
      remove(filmPopupComponent);

      bodyElement.classList.remove(`hide-overflow`);
    };

    filmPopupComponent.setClosePopupClickHandler(closeFilmPopup);

  };

  filmComponent.setOpenPopupClickHandler(openFilmPopup);

};

const renderFilmsBorder = (boardContainer, boardFilms) => {
  const noFilmsBoard = new NoFilmsView();
  const filmsBoard = new AllFilmsView();
  const ratedFilmsContainer = new RatedFilmsView();
  const commentedFilmsContainer = new CommentedFilmsView();


  if (boardFilms.length === 0) {
    render(boardContainer, noFilmsBoard, RenderPosition.BEFOREEND);
    return;
  }

  render(boardContainer, filmsBoard, RenderPosition.BEFOREEND);
  const filmsBoardContainer = boardContainer.querySelector(`.films-list__container`);


  boardFilms
    .slice(0, Math.min(boardFilms.length, FILMS_COUNT_PER_STEP))
    .forEach((film) => renderFilm(filmsBoardContainer, film));

  if (boardFilms.length > FILMS_COUNT_PER_STEP) {
    let renderedFilmsCount = FILMS_COUNT_PER_STEP;

    const loadMoreButton = new ShowMoreBtnView();

    render(filmsBoardContainer, loadMoreButton, RenderPosition.AFTEREND);

    loadMoreButton.setClickHandler(() => {
      films
      .slice(renderedFilmsCount, renderedFilmsCount + FILMS_COUNT_PER_STEP)
      .forEach((film) => renderFilm(filmsBoardContainer, film));

      renderedFilmsCount += FILMS_COUNT_PER_STEP;

      if (renderedFilmsCount >= films.length) {
        remove(loadMoreButton);
      }
    });
  }

  render(filmsBoard, ratedFilmsContainer, RenderPosition.BEFOREEND);
  render(filmsBoard, commentedFilmsContainer, RenderPosition.BEFOREEND);

  const topFilmsSections = filmsBoard.getElement().querySelectorAll(`.films-list--extra`);

  topFilmsSections.forEach((section) => {
    const container = section.querySelector(`.films-list__container`);
    for (let i = 0; i < EXTRA_FILMS_COUNT; i++) {
      renderFilm(container, films[i]);
    }
  });

};


render(footerElement, new StatisticsView(films.length), RenderPosition.BEFOREEND);

renderFilmsBorder(mainElement, films);
