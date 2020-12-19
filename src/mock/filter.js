const filmsToFilterMap = {
  ALL: (films) => films.length,
  WATCHLIST: (films) => films.filter((film) => film.isWatchlist).length,
  HISTORY: (films) => films.filter((film) => film.isWatched).length,
  FAVORITES: (films) => films.filter((film) => film.isFavorite).length
};

export const generateFilter = (films) => {
  return Object.entries(filmsToFilterMap).map(([filterName, countFilms]) => {
    return {
      name: filterName,
      count: countFilms(films),
    };
  });
};
