import NavigationView from './view/navigation-view';
import ProfileView from './view/profile-view';
import StatisticsView from './view/statistics-view';

import PagePresenter from './presenter/page-presenter';

import FilmsModel from './model/films-model';

import {generateFilm} from './mock/film';
import {generateFilter} from './mock/filter';
import {render, RenderPosition} from './utils/render';

const FILMS_COUNT = 20;

const films = new Array(FILMS_COUNT).fill().map(generateFilm);
const filters = generateFilter(films);
const filmsModel = new FilmsModel();

filmsModel.setFilms(films);

const bodyElement = document.querySelector(`body`);
const headerElement = bodyElement.querySelector(`.header`);
const mainElement = bodyElement.querySelector(`.main`);
const footerElement = bodyElement.querySelector(`.footer`);
const pagePresenter = new PagePresenter(mainElement, filmsModel);

render(headerElement, new ProfileView(), RenderPosition.BEFOREEND);
render(mainElement, new NavigationView(filters), RenderPosition.AFTERBEGIN);


render(footerElement, new StatisticsView(films.length), RenderPosition.BEFOREEND);

pagePresenter.init();
