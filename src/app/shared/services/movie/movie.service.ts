import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Movie } from '../../models/movie.model';
import { API_BASE_URL, IMAGE_BASE_URL } from '../../constants/api.constants';
import { Genre } from '../../models/genre.enum';

@Injectable({ providedIn: 'root' })
export class MovieService {
  private baseUrl = API_BASE_URL;

  constructor(private http: HttpClient) {}

  discoverMovies(genreId: string | Genre, page: number): Observable<{ results: Movie[] }> {
    const params = new HttpParams()
      .set('with_genres', genreId.toString())
      .set('page', page.toString());
    return this.http.get<{ results: Movie[] }>(
      `${this.baseUrl}/discover/movie`, { params }
    );
  }

  public getMovieDetails(id: number): Observable<Movie> {
    return this.http.get<Movie>(
      `${this.baseUrl}/movie/${id}`
    );
  }

  public getPosterUrl(path: string) {
    return `${IMAGE_BASE_URL}${path}`;
  }

  getMovieVideos(id: number) {
    return this.http.get<any>(`${this.baseUrl}/movie/${id}/videos`);
  }

  getMovieCredits(id: number) {
    return this.http.get<any>(`${this.baseUrl}/movie/${id}/credits`);
  }

  getSimilarMovies(id: number) {
    return this.http.get<any>(`${this.baseUrl}/movie/${id}/similar`);
  }

  getProfileUrl(path: string) {
    return path ? `${IMAGE_BASE_URL}${path}` : '';
  }

  getBackdropUrl(path: string) {
    return path ? `https://image.tmdb.org/t/p/original${path}` : "";
  }
}