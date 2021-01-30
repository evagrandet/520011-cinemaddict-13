export const KeyCode = {
  ESC: `Escape`,
  ENTER: `Enter`,
};

export const SortType = {
  DEFAULT: `default`,
  DATE: `date`,
  RATING: `rating`
};

export const UserAction = {
  UPDATE_FILM: `UPDATE_FILM`,
  ADD_COMMENT: `ADD_COMMENT`,
  DELETE_COMMENT: `DELETE_COMMENT`
};

export const UpdateType = {
  PATCH: `PATCH`,
  MINOR: `MINOR`,
  MAJOR: `MAJOR`,
  INIT: `INIT`
};

export const FilterType = {
  ALL: `All`,
  WATCHLIST: `Watchlist`,
  HISTORY: `History`,
  FAVORITES: `Favorites`,
};

export const MenuItem = {
  FILMS: `films`,
  STATS: `stats`,
};

export const RankScore = {
  NOVICE: {
    MIN: 1,
    MAX: 10
  },
  FAN: {
    MIN: 11,
    MAX: 20
  }
};

export const RankTitle = {
  NONE: ``,
  NOVICE: `Novice`,
  FAN: `Fan`,
  MOVIE_BUFF: `Movie Buff`
};

export const EMOJIS = [`angry`, `puke`, `sleeping`, `smile`];


export const DescriptionSymbols = {
  MAX: 140,
  MAX_VISIBLE: 139
};

export const State = {
  ADDING: `ADDING`,
  DELETING: `DELETING`,
  ABORT_ADDING: `ABORT_ADDING`,
  ABORT_DELETING: `ABORT_DELETING`,
  DEFAULT: `DEFAULT`
};
