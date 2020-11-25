import dayjs from "dayjs";

export const emojis = [`angry`, `puke`, `sleeping`, `smile`];

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
  MAX: 5
};

export const RatingLimits = {
  MIN: 0,
  MAX: 10
};

export const AgeRatings = {
  MIN: 0,
  MAX: 18
};

export const DescriptionSymbols = {
  MAX: 140,
  MAX_VISIBLE: 139
};
