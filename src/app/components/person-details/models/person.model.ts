export interface Person {
  id: number;
  name: string;
  biography: string;
  birthday: string | null;
  deathday: string | null;
  place_of_birth: string | null;
  gender: number;
  known_for_department: string;
  also_known_as: string[];
  profile_path: string | null;
  homepage: string | null;
}

export interface PersonCredit {
  cast: Array<{
    id: number;
    title: string;
    poster_path: string | null;
    character: string;
    release_date: string;
  }>;
}

export interface PersonImage {
  profiles: Array<{
    file_path: string;
    width: number;
    height: number;
  }>;
}

export interface PersonSocials {
  imdb_id?: string;
  wikidata_id?: string;
  facebook_id?: string;
  instagram_id?: string;
  twitter_id?: string;
  youtube_id?: string;
}
