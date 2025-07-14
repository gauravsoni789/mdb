export interface Cast {
  id: number;
  name: string;
  profile_path?: string;
  character?: string;
}

export interface Credits {
  id: number;
  cast: Cast[];
  crew: Cast[];
}

export interface Movie {
  id: number;
  title: string;
  overview: string;
  release_date: string;
  poster_path?: string;
  backdrop_path?: string;
  vote_average?: number;
  genre_ids?: number[];
}

export interface MovieVideosResponse {
  id: number;
  results: Video[];
}

export interface PaginatedMoviesResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

export interface SimilarMoviesResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

export interface Video {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
}
