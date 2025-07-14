export interface SearchResultMovie {
  media_type: string;
  id: number;
  title: string;
  poster_path?: string;
  release_date?: string;
  [key: string]: any;
}

export interface SearchResultPerson {
  media_type: string;
  id: number;
  name: string;
  profile_path?: string;
  known_for_department?: string;
  [key: string]: any;
}

export type SearchResultItem = SearchResultMovie | SearchResultPerson;

export interface GroupedSearchResult {
  label: string;
  value: string;
  items: SearchResultItem[];
}
