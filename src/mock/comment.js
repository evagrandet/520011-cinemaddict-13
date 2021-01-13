import dayjs from 'dayjs';
import {PeriodComments, EMOJIS} from '../const';
import {getRandomInteger, generateItem} from '../utils/common';


const authors = [`Bella Hudson`, `Eva Wells`, `Keira Hayes`, `Libby Hughes`, `Imogen Thomson`, `Elisa Butler`, `Rebekah Travis`, `Presley Boone`, `Nahla Snider`, `Genesis Buckley`];
const texts = [`good`, `must watch!`, `boring`, `watched 2 times`, `horrible!`];


const generateComment = (id) => {
  const date = dayjs(getRandomInteger(PeriodComments.END.valueOf(), PeriodComments.START.valueOf()));
  return {
    id,
    author: generateItem(authors),
    date,
    emoji: generateItem(EMOJIS),
    text: generateItem(texts)
  };
};

const generateFilmComments = (commentIds) => {
  const filmComments = [];

  commentIds.forEach((id) => {
    filmComments.push(generateComment(id));
  });

  return filmComments;
};

export const generateComments = (films) => {
  const comments = [];

  films.forEach((film) => {
    comments.push(generateFilmComments(film.commentIds));
  });

  return comments;
};
