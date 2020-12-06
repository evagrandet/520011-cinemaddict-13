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
import {render, RenderPosition} from './util';
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

render(headerElement, new ProfileView().getElement(), RenderPosition.BEFOREEND);
render(mainElement, new NavigationView(filters).getElement(), RenderPosition.AFTERBEGIN);
render(mainElement, new SortingView().getElement(), RenderPosition.BEFOREEND);


const renderFilm = (filmsContainer, film) => {
  const filmComponent = new FilmCardView(film);

  render(filmsContainer, filmComponent.getElement(), RenderPosition.BEFOREEND);

  const filmTitle = filmComponent.getElement().querySelector(`.film-card__title`);
  const filmPoster = filmComponent.getElement().querySelector(`.film-card__poster`);
  const filmComments = filmComponent.getElement().querySelector(`.film-card__comments`);

  const closeFilmPopup = (popup) => {
    popup.remove();
    bodyElement.classList.remove(`hide-overflow`);
  };

  const openFilmPopup = () => {
    bodyElement.classList.add(`hide-overflow`);
    render(footerElement, new FilmPopupView(film).getElement(), RenderPosition.AFTEREND);

    const filmPopup = bodyElement.querySelector(`.film-details`);
    const closeFilmPopupBtn = filmPopup.querySelector(`.film-details__close-btn`);

    closeFilmPopupBtn.addEventListener(`click`, () => {
      closeFilmPopup(filmPopup);
    });

    document.addEventListener(`keydown`, (evt) => {
      evt.preventDefault();
      if (evt.key === ESC_KEY) {
        closeFilmPopup(filmPopup);
      }
    });
  };

  filmTitle.addEventListener(`click`, () => {
    openFilmPopup();
  });

  filmPoster.addEventListener(`click`, () => {
    openFilmPopup();
  });

  filmComments.addEventListener(`click`, () => {
    openFilmPopup();
  });
};

const renderFilmsBorder = (boardContainer, boardFilms) => {
  const noFilmsBoard = new NoFilmsView();
  const filmsBoard = new AllFilmsView();
  const ratedFilmsContainer = new RatedFilmsView();
  const commentedFilmsContainer = new CommentedFilmsView();


  if (boardFilms.length === 0) {
    render(boardContainer, noFilmsBoard.getElement(), RenderPosition.BEFOREEND);
    return;
  }

  render(boardContainer, filmsBoard.getElement(), RenderPosition.BEFOREEND);
  const filmsBoardContainer = boardContainer.querySelector(`.films-list__container`);


  boardFilms
    .slice(0, Math.min(boardFilms.length, FILMS_COUNT_PER_STEP))
    .forEach((film) => renderFilm(filmsBoardContainer, film));

  if (boardFilms.length > FILMS_COUNT_PER_STEP) {
    let renderedFilmsCount = FILMS_COUNT_PER_STEP;

    render(filmsBoardContainer, new ShowMoreBtnView().getElement(), RenderPosition.AFTEREND);

    const loadMoreButton = filmsBoard.getElement().querySelector(`.films-list__show-more`);

    const onLoadMoreBtnClick = (evt) => {
      evt.preventDefault();
      films
      .slice(renderedFilmsCount, renderedFilmsCount + FILMS_COUNT_PER_STEP)
      .forEach((film) => renderFilm(filmsBoardContainer, film));

      renderedFilmsCount += FILMS_COUNT_PER_STEP;

      if (renderedFilmsCount >= films.length) {
        loadMoreButton.remove();
      }
    };

    loadMoreButton.addEventListener(`click`, onLoadMoreBtnClick);
  }

  render(filmsBoard.getElement(), ratedFilmsContainer.getElement(), RenderPosition.BEFOREEND);
  render(filmsBoard.getElement(), commentedFilmsContainer.getElement(), RenderPosition.BEFOREEND);

  const topFilmsSections = filmsBoard.getElement().querySelectorAll(`.films-list--extra`);

  topFilmsSections.forEach((section) => {
    const container = section.querySelector(`.films-list__container`);
    for (let i = 0; i < EXTRA_FILMS_COUNT; i++) {
      renderFilm(container, films[i]);
    }
  });

};


render(footerElement, new StatisticsView(films.length).getElement(), RenderPosition.BEFOREEND);

renderFilmsBorder(mainElement, films);
