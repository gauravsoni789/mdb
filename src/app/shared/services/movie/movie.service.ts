import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Movie, MovieVideosResponse, Credits, SimilarMoviesResponse } from '../../models/movie.model';
import { API_BASE_URL, IMAGE_BASE_URL, IMAGE_ORIGINAL_URL } from '../../constants/api.constants';
import { Genre } from '../../models/genre.enum';

@Injectable({ providedIn: 'root' })
export class MovieService {
  private baseUrl = API_BASE_URL;

  constructor(private http: HttpClient) {}

  public discoverMovies(genreId: string | Genre, page: number): Observable<{ results: Movie[] }> {
    const params = new HttpParams()
      .set('with_genres', genreId.toString())
      .set('page', page.toString());
    return this.http.get<{ results: Movie[] }>(`${this.baseUrl}/discover/movie`, { params });
  }

  public getBackdropUrl(path: string | undefined): string {
    return path ? `${IMAGE_ORIGINAL_URL}${path}` : '';
  }

  public getMovieCredits(id: number): Observable<Credits> {
    return this.http.get<Credits>(`${this.baseUrl}/movie/${id}/credits`);
  }

  public getMovieDetails(id: number): Observable<Movie> {
    return this.http.get<Movie>(`${this.baseUrl}/movie/${id}`);
  }

  public getMovieVideos(id: number): Observable<MovieVideosResponse> {
    return this.http.get<MovieVideosResponse>(`${this.baseUrl}/movie/${id}/videos`);
  }

  public getPosterUrl(path: string): string {
    return `${IMAGE_BASE_URL}${path}`;
  }

  public getProfileUrl(path: string | undefined): string {
    return path ? `${IMAGE_BASE_URL}${path}` : '';
  }

  public getSimilarMovies(id: number): Observable<SimilarMoviesResponse> {
    return this.http.get<SimilarMoviesResponse>(`${this.baseUrl}/movie/${id}/similar`);
  }
}
