import dayjs from "dayjs";
import {MINS_IN_HOUR, DESCRIPTION, ReleaseDates, Duration, DescriptionLength, CommentsCount, RatingLimits, AgeRatings} from '../const';
import {getRandomInteger, generateItem, generateUniqItems} from '../util';
import {generateComment} from './comment';


const posterItems = [`made-for-each-other.png`, `popeye-meets-sinbad.png`, `sagebrush-trail.jpg`, `santa-claus-conquers-the-martians.jpg`, `the-dance-of-life.jpg`, `the-great-flamarion.jpg`, `the-man-with-the-golden-arm.jpg`];
const titlesItems = [`Breakfast at Tiffany's`, `2001: A Space Odyssey`, `Monty Python's Life of Brian`, `Casablanca`, `Gaslight`, `Gone with the Wind`, `Roman Holiday`];
const directorItems = [`Alice Winocour`, `Amma Asante`, `Ana Lily Amirpour`, `Andrea Arnold`, `Anna Boden`, `Barbra Streisand`, `Elizabeth Banks`, `Gail Mancuso`, `Gia Coppola`];
const writerItems = [`Maggie Gyllenhaal`, `Diablo Cody`, `Lucinda Coxon`, `Karen Croner`, `Philippa Boyens`, `Fran Walsh`, `Gillian Flynn`, `Abi Morgan`, `Nancy Oliver`, `Vanessa Taylor`, `Olivia Hetreed`];
const actorItems = [`Meryl Streep`, `Katharine Hepburn`, `Ingrid Bergman`, `Bette Davis`, `Audrey Hepburn`, `Elizabeth Taylor`, `Judy Garland`, `Cate Blanchett`, `Grace Kelly`, `Sigourney Weaver`, `Nicole Kidman`, `Natalie Portman`];
const genresItems = [`Action Adventure`, `Science fiction`, `Epics/ Historical`, `Animation`, `Fantasy`, `Drama`, `Romantic Comedy`, `Crime/ Gangster`, `Horror`, `Musicals/ Dance`];


export const generateFilm = () => {
  const poster = generateItem(posterItems);
  const releaseDate = dayjs(getRandomInteger(ReleaseDates.START.valueOf(), ReleaseDates.END.valueOf()));

  const title = generateItem(titlesItems);
  const director = generateItem(directorItems);
  const writers = generateUniqItems(writerItems).join(`, `);
  const actors = generateUniqItems(actorItems).join(`, `);
  const genres = generateUniqItems(genresItems);

  const generateDuration = () => {
    const duration = getRandomInteger(Duration.MINIMUM, Duration.MAXIMUM);

    const hours = Math.round(duration / MINS_IN_HOUR);
    const minutes = duration % MINS_IN_HOUR;

    return `${hours}h ${minutes}m`;
  };

  const generateDescription = (text) => {
    const textItems = text.split(`.`);
    const count = getRandomInteger(DescriptionLength.MINIMUM, DescriptionLength.MAXIMUM);
    return textItems.slice(0, count).join(`.`);
  };

  const generateComments = () => {
    const commentsCount = getRandomInteger(CommentsCount.MIN, CommentsCount.MAX);

    return new Array(commentsCount).fill().map(generateComment);
  };

  const generateRating = () => {
    const integerValue = getRandomInteger(RatingLimits.MIN, RatingLimits.MAX);
    const fractionalValue = getRandomInteger(RatingLimits.MIN, RatingLimits.MAX);

    return `${integerValue}.${fractionalValue}`;
  };

  return {
    poster,
    title,
    originTitle: title,
    director,
    writers,
    actors,
    rating: generateRating(),
    ageRating: `${getRandomInteger(AgeRatings.MIN, AgeRatings.MAX)}+`,
    releaseDate,
    duration: generateDuration(),
    genres,
    description: generateDescription(DESCRIPTION),
    isInWatchlist: Boolean(getRandomInteger(0, 1)),
    isWatched: Boolean(getRandomInteger(0, 1)),
    isFavorite: Boolean(getRandomInteger(0, 1)),
    comments: generateComments()
  };
};
