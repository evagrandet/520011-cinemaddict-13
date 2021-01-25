import FilmsModel from './model/films-model';
import CommentsModel from './model/comments-model';
import FilterModel from './model/filter-model';

import ProfileView from './view/profile-view';
import FooterStatisticsView from './view/footer-statistics-view';
import MenuView from './view/menu-view';
import StatisticsView from './view/statistics-view';

import PagePresenter from './presenter/page-presenter';
import FilterPresenter from './presenter/filter-presenter';

import {render, RenderPosition} from './utils/render';
import {MenuItem, UpdateType} from './const.js';

import Api from './api/api';

const AUTHORIZATION = `Basic NSoYZtfMpZzk6V8Hq`;
const END_POINT = `https://13.ecmascript.pages.academy/cinemaddict`;
const api = new Api(END_POINT, AUTHORIZATION);

const bodyElement = document.querySelector(`body`);
const headerElement = bodyElement.querySelector(`.header`);
const mainElement = bodyElement.querySelector(`.main`);
const footerElement = bodyElement.querySelector(`.footer`);
const menuComponent = new MenuView();
// const comments = generateComments(films);
const filmsModel = new FilmsModel();
const commentsModel = new CommentsModel();
const filterModel = new FilterModel();
const pagePresenter = new PagePresenter(mainElement, filmsModel, commentsModel, filterModel, api);
const filterPresenter = new FilterPresenter(menuComponent, filterModel, filmsModel);


// commentsModel.setComments(comments);

render(headerElement, new ProfileView(), RenderPosition.BEFOREEND);
render(mainElement, menuComponent, RenderPosition.AFTERBEGIN);

const statisticComponent = new StatisticsView(filmsModel);
render(mainElement, statisticComponent, RenderPosition.BEFOREEND);
statisticComponent.hide();

menuComponent.setOnChangeHandler((menuItem) => {
  switch (menuItem) {
    case MenuItem.FILMS:
      statisticComponent.hide();
      pagePresenter.show();
      break;

    case MenuItem.STATS:
      pagePresenter.hide();
      statisticComponent.updateElement();
      statisticComponent.show();
      break;
  }
});

// render(footerElement, new FooterStatisticsView(films.length), RenderPosition.BEFOREEND);

filterPresenter.init();
pagePresenter.init();

api.getFilms()
  .then((films) => {
    filmsModel.setFilms(UpdateType.INIT, films);
  })
  .catch(() => {
    filmsModel.setFilms(UpdateType.INIT, []);
  });
