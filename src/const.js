import dayjs from "dayjs";

export const MINS_IN_HOUR = 60;
export const DESCRIPTION = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.`;

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
