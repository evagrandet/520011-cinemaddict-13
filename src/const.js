import dayjs from 'dayjs';

export const ESC_KEY = `Escape`;
export const FILMS_COUNT_PER_STEP = 5;

export const SortType = {
  DEFAULT: `default`,
  DATE: `by-date`,
  RATING: `by-rating`
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
