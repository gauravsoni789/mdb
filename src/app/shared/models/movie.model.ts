export interface Movie {
  vote_average: any;
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
}

export interface PaginatedMoviesResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}
