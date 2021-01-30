export const sortByDate = (filmA, filmB) => filmB.releaseDate.unix() - filmA.releaseDate.unix();


export const sortByRating = (filmA, filmB) => filmB.rating - filmA.rating;


export const sortByCommentsCount = (filmA, filmB) => filmB.commentIds.length - filmA.commentIds.length;
