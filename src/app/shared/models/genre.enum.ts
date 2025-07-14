export enum Genre {
  COMEDY = 35,     // Feel Good
  ACTION = 28,     // Action
  MYSTERY = 9648   // Mind Benders
}

export const GenreNames: Record<Genre, string> = {
  [Genre.COMEDY]: 'Feel Good',
  [Genre.ACTION]: 'Action Fix',
  [Genre.MYSTERY]: 'Mind Benders'
};