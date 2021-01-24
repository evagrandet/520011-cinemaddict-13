import {FilterType} from '../const';

const filter = {
  [FilterType.ALL]: (films) => films.slice(),
  [FilterType.WATCHLIST]: (films) => films.filter((film) => film.isWatchlist),
  [FilterType.HISTORY]: (films) => films.filter((film) => film.isWatched),
  [FilterType.FAVORITES]: (films) => films.filter((film) => film.isFavorite),
};

export default class Filters {
  static getFilter(films, filterType) {
    return filter[filterType](films);
  }

  static getFilterCount(films, filterType) {
    return this.getFilter(films, filterType).length;
  }
}
