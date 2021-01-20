import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import duration from 'dayjs/plugin/duration';

import AbstractSmartView from './abstract-smart-view';
import {getUserRank} from '../utils/common';


dayjs.extend(isBetween);
dayjs.extend(duration);

const StatisticPeriod = {
  ALL_TIME: `all-time`,
  TODAY: `today`,
  WEEK: `week`,
  MONTH: `month`,
  YEAR: `year`,
};

const getUserRankTemplate = (rank) => {
  return rank ? `<p class="statistic__rank">
      Your rank
      <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
      <span class="statistic__rank-label">${rank}</span>
    </p>` : ``;
};


const createStatsTemplate = (statistic) => {
  const {watchedFilmsCount, userRank, totalDuration, topGenre, activeFilter} = statistic;
  const {hours, minutes} = dayjs.duration(totalDuration, `minutes`).$d;
  const userRankTemplate = getUserRankTemplate(userRank);
  const getCheckedStatus = (filter) => activeFilter === filter ? `checked` : ``;
  return `<section class="statistic">
    ${userRankTemplate}
    <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
      <p class="statistic__filters-description">Show stats:</p>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-all-time" value="${StatisticPeriod.ALL_TIME}" ${getCheckedStatus(StatisticPeriod.ALL_TIME)}>
      <label for="statistic-all-time" class="statistic__filters-label">All time</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-today" value="${StatisticPeriod.TODAY}" ${getCheckedStatus(StatisticPeriod.TODAY)}>
      <label for="statistic-today" class="statistic__filters-label">Today</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-week" value="${StatisticPeriod.WEEK}" ${getCheckedStatus(StatisticPeriod.WEEK)}>
      <label for="statistic-week" class="statistic__filters-label">Week</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-month" value="${StatisticPeriod.MONTH}" ${getCheckedStatus(StatisticPeriod.MONTH)}>
      <label for="statistic-month" class="statistic__filters-label">Month</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-year" value="${StatisticPeriod.YEAR}" ${getCheckedStatus(StatisticPeriod.YEAR)}>
      <label for="statistic-year" class="statistic__filters-label">Year</label>
    </form>

    <ul class="statistic__text-list">
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">You watched</h4>
        <p class="statistic__item-text">${watchedFilmsCount} <span class="statistic__item-description">movies</span></p>
      </li>
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">Total duration</h4>
        <p class="statistic__item-text">${hours} <span class="statistic__item-description">h</span> ${minutes} <span class="statistic__item-description">m</span></p>
      </li>
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">Top genre</h4>
        <p class="statistic__item-text">${topGenre}</p>
      </li>
    </ul>

    <div class="statistic__chart-wrap">
      <canvas class="statistic__chart" width="1000"></canvas>
    </div>

  </section>`;
};
export default class StatsView extends AbstractSmartView {
  constructor(filmsModel) {
    super();

    this._filmsModel = filmsModel;

    this._activeFilter = StatisticPeriod.ALL_TIME;

    this._filmsChart = null;

    this._setFilterChangeHandler = this._setFilterChangeHandler.bind(this);

    this.restoreHandlers();
  }

  getTemplate() {
    return createStatsTemplate(this._getFilmsDataByFilter(this._activeFilter));
  }

  restoreHandlers() {
    this._setFilterChangeHandler();
    this._setChart();
  }

  _setFilterChangeHandler() {
    this.getElement().querySelectorAll(`.statistic__filters-input`).forEach((element) => element.addEventListener(`change`, (evt) => {
      this._activeFilter = evt.target.value;
      this.updateElement();
    }));
  }

  _getFilmsDataByFilter(activeFilter) {
    const films = this._filmsModel.getFilms();
    const currentDate = dayjs();
    const weekAgoDate = dayjs().subtract(7, `day`).toDate();
    const monthAgoDate = dayjs().subtract(1, `month`).toDate();
    const yearAgoDate = dayjs().subtract(1, `year`).toDate();
    let filmsWatched = [];

    switch (activeFilter) {
      case StatisticPeriod.ALL_TIME:
        filmsWatched = films
          .filter((film) => film.isWatched);
        break;

      case StatisticPeriod.TODAY:
        filmsWatched = films
          .filter((film) => film.isWatched && dayjs(film.watchingDate).isSame(currentDate, `day`));
        break;

      case StatisticPeriod.WEEK:
        filmsWatched = films
          .filter((film) => film.isWatched && dayjs(film.watchingDate).isBetween(weekAgoDate, currentDate));
        break;

      case StatisticPeriod.MONTH:
        filmsWatched = films
          .filter((film) => film.isWatched && dayjs(film.watchingDate).isBetween(monthAgoDate, currentDate));
        break;

      case StatisticPeriod.YEAR:
        filmsWatched = films
          .filter((film) => film.isWatched && dayjs(film.watchingDate).isBetween(yearAgoDate, currentDate));
        break;
    }

    const watchedFilmsCount = filmsWatched.length;
    const userRank = getUserRank(this._filmsModel.getFilms());
    const totalDuration = filmsWatched.reduce((count, film) => count + film.filmDuration, 0);
    const allFilmsGenres = filmsWatched.reduce((allGenres, film) => {
      allGenres.push(...film.genres);

      return allGenres;
    }, []);

    let genresList = new Map();

    allFilmsGenres.forEach((genre) => {
      if (genresList.has(genre)) {
        let genreCount = genresList.get(genre);

        genresList.set(genre, ++genreCount);
      } else {
        genresList.set(genre, 1);
      }
    });

    genresList = new Map([...genresList.entries()].sort((genreA, genreB) => genreB[1] - genreA[1]));
    const topGenre = genresList.size > 0 ? genresList.keys().next().value : ``;

    return {
      watchedFilmsCount,
      userRank,
      totalDuration,
      genresList,
      topGenre,
      activeFilter
    };
  }


  _renderStatitsicsChart(statisticCtx, genresList) {
    return new Chart(statisticCtx, {
      plugins: [ChartDataLabels],
      type: `horizontalBar`,
      data: {
        labels: [...genresList.keys()],
        datasets: [{
          data: [...genresList.values()],
          backgroundColor: `#ffe800`,
          hoverBackgroundColor: `#ffe800`,
          anchor: `start`,
          barThickness: 24
        }]
      },
      options: {
        plugins: {
          datalabels: {
            font: {
              size: 20
            },
            color: `#ffffff`,
            anchor: `start`,
            align: `start`,
            offset: 40,
          }
        },
        scales: {
          yAxes: [{
            ticks: {
              fontColor: `#ffffff`,
              padding: 100,
              fontSize: 20
            },
            gridLines: {
              display: false,
              drawBorder: false
            },
          }],
          xAxes: [{
            ticks: {
              display: false,
              beginAtZero: true
            },
            gridLines: {
              display: false,
              drawBorder: false
            },
          }],
        },
        legend: {
          display: false
        },
        tooltips: {
          enabled: false
        }
      }
    });
  }

  _setChart() {
    if (this._statisticChart) {
      this._statisticChart = null;
    }

    const BAR_HEIGHT = 50;
    const statisticCtx = this.getElement().querySelector(`.statistic__chart`);

    const {genresList} = this._getFilmsDataByFilter(this._activeFilter);

    statisticCtx.height = BAR_HEIGHT * genresList.size;

    this._renderStatitsicsChart(statisticCtx, genresList);
  }
}
