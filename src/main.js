import {createProfileTemplate} from './view/profile';
import {createNavigationTemplate} from './view/navigation';
import {createSortingTemplate} from './view/sorting';
import {createAllFilmsTemplate} from './view/all-films';
import {createFilmCardTemplate} from './view/film-card';
import {createShowMoreButtonTemplate} from './view/show-more-btn';
import {createRatedFilmsTemplate} from './view/rated-films';
import {createCommentedFilmsTemplate} from './view/commented-films';
import {createStatisticsTemplate} from './view/statistics';
import {createFilmPopupTemplate} from './view/film-popup';
import {generateFilm} from './mock/film';
import {generateFilter} from "./mock/filter.js";

const FILMS_COUNT = 20;
const FILMS_COUNT_PER_STEP = 5;
const EXTRA_FILMS_COUNT = 2;

const films = new Array(FILMS_COUNT).fill().map(generateFilm);
const filters = generateFilter(films);

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const headerElement = document.querySelector(`.header`);
const mainElement = document.querySelector(`.main`);
const footerElement = document.querySelector(`.footer`);


render(headerElement, createProfileTemplate(), `beforeend`);
render(mainElement, createNavigationTemplate(filters), `afterbegin`);
render(mainElement, createSortingTemplate(), `beforeend`);
render(mainElement, createAllFilmsTemplate(), `beforeend`);

const filmsList = mainElement.querySelector(`.films`);
const filmsContainer = filmsList.querySelector(`.films-list__container`);

for (let i = 0; i < Math.min(films.length, FILMS_COUNT_PER_STEP); i++) {
  render(filmsContainer, createFilmCardTemplate(films[i]), `beforeend`);
}

if (films.length > FILMS_COUNT_PER_STEP) {
  let renderedFilmsCount = FILMS_COUNT_PER_STEP;
  render(filmsContainer, createShowMoreButtonTemplate(), `afterend`);
  const loadMoreButton = filmsList.querySelector(`.films-list__show-more`);

  loadMoreButton.addEventListener(`click`, (evt) => {
    evt.preventDefault();
    films
      .slice(renderedFilmsCount, renderedFilmsCount + FILMS_COUNT_PER_STEP)
      .forEach((film) => render(filmsContainer, createFilmCardTemplate(film), `beforeend`));

    renderedFilmsCount += FILMS_COUNT_PER_STEP;

    if (renderedFilmsCount >= films.length) {
      loadMoreButton.remove();
    }
  });
}

render(filmsList, createRatedFilmsTemplate(), `beforeend`);
render(filmsList, createCommentedFilmsTemplate(), `beforeend`);

const topFilmsSections = filmsList.querySelectorAll(`.films-list--extra`);

topFilmsSections.forEach((section) => {
  const container = section.querySelector(`.films-list__container`);
  for (let i = 0; i < EXTRA_FILMS_COUNT; i++) {
    render(container, createFilmCardTemplate(films[i]), `beforeend`);
  }
});

render(footerElement, createStatisticsTemplate(films.length), `beforeend`);

// render(footerElement, createFilmPopupTemplate(films[0]), `afterend`);
