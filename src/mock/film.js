import dayjs from 'dayjs';
import {ReleaseDates, Duration, DescriptionLength, CommentsCount, RatingLimits, AgeRatings} from '../const';
import {getRandomInteger, generateItem, generateUniqueItems} from '../utils/common';

export const DESCRIPTION = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.`;

const WATCHED_DATE_START = dayjs(`2020-06-05`);
const posterItems = [`made-for-each-other.png`, `popeye-meets-sinbad.png`, `sagebrush-trail.jpg`, `santa-claus-conquers-the-martians.jpg`, `the-dance-of-life.jpg`, `the-great-flamarion.jpg`, `the-man-with-the-golden-arm.jpg`];
const titlesItems = [`Breakfast at Tiffany's`, `2001: A Space Odyssey`, `Monty Python's Life of Brian`, `Casablanca`, `Gaslight`, `Gone with the Wind`, `Roman Holiday`];
const directorItems = [`Alice Winocour`, `Amma Asante`, `Ana Lily Amirpour`, `Andrea Arnold`, `Anna Boden`, `Barbra Streisand`, `Elizabeth Banks`, `Gail Mancuso`, `Gia Coppola`];
const writerItems = [`Maggie Gyllenhaal`, `Diablo Cody`, `Lucinda Coxon`, `Karen Croner`, `Philippa Boyens`, `Fran Walsh`, `Gillian Flynn`, `Abi Morgan`, `Nancy Oliver`, `Vanessa Taylor`, `Olivia Hetreed`];
const actorItems = [`Meryl Streep`, `Katharine Hepburn`, `Ingrid Bergman`, `Bette Davis`, `Audrey Hepburn`, `Elizabeth Taylor`, `Judy Garland`, `Cate Blanchett`, `Grace Kelly`, `Sigourney Weaver`, `Nicole Kidman`, `Natalie Portman`];
const genresItems = [`Action Adventure`, `Science fiction`, `Epics/ Historical`, `Animation`, `Fantasy`, `Drama`, `Romantic Comedy`, `Crime/ Gangster`, `Horror`, `Musicals/ Dance`];
const countryItems = [`Austria`, `Belgium`, `USA`, `Ukraine`, `Estonia`, `Hungary`, `Vatican City`];

export const generateFilm = (index) => {
  const poster = generateItem(posterItems);
  const releaseDate = dayjs(getRandomInteger(ReleaseDates.START.valueOf(), ReleaseDates.END.valueOf()));

  const title = generateItem(titlesItems);
  const director = generateItem(directorItems);
  const writers = generateUniqueItems(writerItems).join(`, `);
  const actors = generateUniqueItems(actorItems).join(`, `);
  const genres = generateUniqueItems(genresItems);
  const country = generateItem(countryItems);


  const generateDescription = (text) => {
    const textItems = text.split(`.`);
    const count = getRandomInteger(DescriptionLength.MINIMUM, DescriptionLength.MAXIMUM);
    return textItems.slice(0, count).join(`.`);
  };

  const generateCommentIds = () => {
    const commentsCount = getRandomInteger(CommentsCount.MIN, CommentsCount.MAX);
    const commentIds = [];
    for (let i = 0; i <= commentsCount; i++) {
      const commentId = getRandomInteger(0, 100);
      commentIds.push(commentId);
    }

    return Array.from(new Set(commentIds));
  };

  const generateRating = () => {
    const integerValue = getRandomInteger(RatingLimits.MIN, RatingLimits.MAX);
    const fractionalValue = getRandomInteger(RatingLimits.MIN, RatingLimits.MAX);

    return `${integerValue}.${fractionalValue}`;
  };

  return {
    id: index,
    poster,
    title,
    originTitle: title,
    director,
    writers,
    actors,
    rating: generateRating(),
    ageRating: `${getRandomInteger(AgeRatings.MIN, AgeRatings.MAX)}+`,
    releaseDate,
    filmDuration: getRandomInteger(Duration.MINIMUM, Duration.MAXIMUM),
    genres,
    country,
    description: generateDescription(DESCRIPTION),
    isWatchlist: Boolean(getRandomInteger(0, 1)),
    isWatched: Boolean(getRandomInteger(0, 1)),
    isFavorite: Boolean(getRandomInteger(0, 1)),
    commentIds: generateCommentIds(),
    watchingDate: dayjs(getRandomInteger(WATCHED_DATE_START, dayjs()))
  };
};
