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
render(mainElement, new AllFilmsView().getElement(), RenderPosition.BEFOREEND);


const filmsList = mainElement.querySelector(`.films`);
const filmsListContainer = filmsList.querySelector(`.films-list__container`);

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

const renderAllFilms = () => {
  for (let i = 0; i < Math.min(films.length, FILMS_COUNT_PER_STEP); i++) {
    renderFilm(filmsListContainer, films[i]);
  }
};

renderAllFilms();


if (films.length > FILMS_COUNT_PER_STEP) {
  let renderedFilmsCount = FILMS_COUNT_PER_STEP;

  render(filmsListContainer, new ShowMoreBtnView().getElement(), RenderPosition.AFTEREND);

  const loadMoreButton = filmsList.querySelector(`.films-list__show-more`);

  const onLoadMoreBtnClick = (evt) => {
    evt.preventDefault();
    films
      .slice(renderedFilmsCount, renderedFilmsCount + FILMS_COUNT_PER_STEP)
      .forEach((film) => renderFilm(filmsListContainer, film));

    renderedFilmsCount += FILMS_COUNT_PER_STEP;

    if (renderedFilmsCount >= films.length) {
      loadMoreButton.remove();
    }
  };

  loadMoreButton.addEventListener(`click`, onLoadMoreBtnClick);
}

render(filmsList, new RatedFilmsView().getElement(), RenderPosition.BEFOREEND);
render(filmsList, new CommentedFilmsView().getElement(), RenderPosition.BEFOREEND);

const topFilmsSections = filmsList.querySelectorAll(`.films-list--extra`);

topFilmsSections.forEach((section) => {
  const container = section.querySelector(`.films-list__container`);
  for (let i = 0; i < EXTRA_FILMS_COUNT; i++) {
    renderFilm(container, films[i]);
  }
});

render(footerElement, new StatisticsView(films.length).getElement(), RenderPosition.BEFOREEND);
