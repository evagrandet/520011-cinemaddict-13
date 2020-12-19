export const sortByDate = (filmA, filmB) => filmB.releaseDate.unix() - filmA.releaseDate.unix();


export const sortByRating = (filmA, filmB) => filmB.rating - filmA.rating;
