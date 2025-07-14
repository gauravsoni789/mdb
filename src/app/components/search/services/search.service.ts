import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { of, switchMap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SearchService {
  private baseUrl = 'https://api.themoviedb.org/3/search/multi';

  constructor(private http: HttpClient) {}

  searchAll(query: string) {
    const params = new HttpParams().set('query', query);
    return this.http.get<any>(this.baseUrl, { params }).pipe(
      switchMap(res => of(res.results || []))
    );
  }
}
