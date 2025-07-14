export interface SearchResult {
  id: number;
  media_type: string; // movie | person | tv
  name?: string; // for person or tv
  title?: string; // for movie
  poster_path?: string;
  profile_path?: string;
}

export interface SearchResponse {
  page: number;
  results: SearchResult[];
  total_pages: number;
  total_results: number;
}
