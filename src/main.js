import ProfileView from './view/profile-view';
import FooterStatisticsView from './view/footer-statistics-view';

import PagePresenter from './presenter/page-presenter';
import FilterPresenter from './presenter/filter-presenter';

import FilmsModel from './model/films-model';
import CommentsModel from './model/comments-model';
import FilterModel from './model/filter-model';
import {generateFilm} from './mock/film';
import {render, RenderPosition} from './utils/render';
import {generateComments} from './mock/comment';

const FILMS_COUNT = 20;

const films = new Array(FILMS_COUNT).fill().map((item, index) => generateFilm(index));
const comments = generateComments(films);
const filmsModel = new FilmsModel();
const commentsModel = new CommentsModel();
const filterModel = new FilterModel();

filmsModel.setFilms(films);
commentsModel.setComments(comments);

const bodyElement = document.querySelector(`body`);
const headerElement = bodyElement.querySelector(`.header`);
const mainElement = bodyElement.querySelector(`.main`);
const footerElement = bodyElement.querySelector(`.footer`);
const pagePresenter = new PagePresenter(mainElement, filmsModel, commentsModel, filterModel);
const filterPresenter = new FilterPresenter(mainElement, filterModel, filmsModel);

render(headerElement, new ProfileView(), RenderPosition.BEFOREEND);


render(footerElement, new FooterStatisticsView(films.length), RenderPosition.BEFOREEND);

filterPresenter.init();
pagePresenter.init();
