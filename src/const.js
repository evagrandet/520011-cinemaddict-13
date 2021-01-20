import dayjs from 'dayjs';

export const KeyCode = {
  ESC: `Escape`,
  ENTER: `Enter`,
  CMD: `Meta`
};
export const FILMS_COUNT_PER_STEP = 5;

export const SortType = {
  DEFAULT: `default`,
  DATE: `by-date`,
  RATING: `by-rating`
};

export const UserAction = {
  UPDATE_FILM: `UPDATE_FILM`,
  ADD_COMMENT: `ADD_COMMENT`,
  DELETE_COMMENT: `DELETE_COMMENT`
};

export const UpdateType = {
  PATCH: `PATCH`,
  MINOR: `MINOR`,
  MAJOR: `MAJOR`
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

export const PeriodComments = {
  START: dayjs(`2019-01-01`),
  END: dayjs(`2020-10-22`)
};

export const ReleaseDates = {
  START: dayjs(`1990-01-01`),
  END: dayjs(`1940-01-01`)
};

export const Duration = {
  MINIMUM: 60,
  MAXIMUM: 180
};
export const DescriptionLength = {
  MINIMUM: 1,
  MAXIMUM: 5
};

export const CommentsCount = {
  MIN: 0,
  MAX: 4
};

export const RatingLimits = {
  MIN: 0,
  MAX: 9
};

export const AgeRatings = {
  MIN: 0,
  MAX: 18
};

export const DescriptionSymbols = {
  MAX: 140,
  MAX_VISIBLE: 139
};
