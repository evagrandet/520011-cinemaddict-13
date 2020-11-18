import {createProfileTemplate} from './view/profile';
import {createNavigationTemplate} from './view/navigation';
import {createSortingTemplate} from './view/sorting';
import {createAllFilmsTemplate} from './view/all-films';
import {createFilmCardTemplate} from './view/film-card';
import {createShowMoreButtonTemplate} from './view/show-more-btn';
import {createRatedFilmsTemplate} from './view/rated-films';
import {createCommentedFilmsTemplate} from './view/commented-films';
import {createStatisticsTemplate} from './view/statistics';


const FILMS_COUNT = 5;
const EXTRA_FILMS_COUNT = 2;

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const headerElement = document.querySelector(`.header`);
const mainElement = document.querySelector(`.main`);
const footerElement = document.querySelector(`.footer`);


render(headerElement, createProfileTemplate(), `beforeend`);
render(mainElement, createNavigationTemplate(), `afterbegin`);
render(mainElement, createSortingTemplate(), `beforeend`);
render(mainElement, createAllFilmsTemplate(), `beforeend`);

const filmsList = mainElement.querySelector(`.films`);
const filmsContainer = filmsList.querySelector(`.films-list__container`);

for (let i = 0; i < FILMS_COUNT; i++) {
  render(filmsContainer, createFilmCardTemplate(), `beforeend`);
}

render(filmsContainer, createShowMoreButtonTemplate(), `afterend`);

render(filmsList, createRatedFilmsTemplate(), `beforeend`);
render(filmsList, createCommentedFilmsTemplate(), `beforeend`);

const topFilmsSections = filmsList.querySelectorAll(`.films-list--extra`);

topFilmsSections.forEach((section) => {
  const container = section.querySelector(`.films-list__container`);
  for (let i = 0; i < EXTRA_FILMS_COUNT; i++) {
    render(container, createFilmCardTemplate(), `beforeend`);
  }
});

render(footerElement, createStatisticsTemplate(), `beforeend`);
