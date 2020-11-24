import dayjs from "dayjs";
import {PeriodComments} from '../const';
import {getRandomInteger, generateItem} from '../util';

const authors = [`Bella Hudson`, `Eva Wells`, `Keira Hayes`, `Libby Hughes`, `Imogen Thomson`, `Elisa Butler`, `Rebekah Travis`, `Presley Boone`, `Nahla Snider`, `Genesis Buckley`];
const emojis = [`angry`, `puke`, `sleeping`, `smile`];

const texts = [`good`, `must watch!`, `boring`, `watched 2 times`, `horrible!`];


export const generateComment = () => {
  const date = dayjs(getRandomInteger(PeriodComments.END.valueOf(), PeriodComments.START.valueOf()));
  return {
    author: generateItem(authors),
    date,
    emoji: generateItem(emojis),
    text: generateItem(texts)
  };
};
