import dayjs from "dayjs";
import {PeriodComments, EMOJIS} from '../const';
import {getRandomInteger, generateItem} from '../utils/common';

const COMMENTS_COUNT = 30;

const authors = [`Bella Hudson`, `Eva Wells`, `Keira Hayes`, `Libby Hughes`, `Imogen Thomson`, `Elisa Butler`, `Rebekah Travis`, `Presley Boone`, `Nahla Snider`, `Genesis Buckley`];
const texts = [`good`, `must watch!`, `boring`, `watched 2 times`, `horrible!`];


export const generateComment = () => {
  const id = getRandomInteger(1, COMMENTS_COUNT);
  const date = dayjs(getRandomInteger(PeriodComments.END.valueOf(), PeriodComments.START.valueOf()));
  return {
    id,
    author: generateItem(authors),
    date,
    emoji: generateItem(EMOJIS),
    text: generateItem(texts)
  };
};
