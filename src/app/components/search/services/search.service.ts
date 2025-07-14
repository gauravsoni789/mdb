import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of, switchMap } from 'rxjs';
import { API_BASE_URL } from '../../../shared/constants/api.constants';
import { SearchResultItem } from '../models/search-result.model';

@Injectable({ providedIn: 'root' })
export class SearchService {
  private baseUrl = `${API_BASE_URL}/search/multi`;

  constructor(private http: HttpClient) {}

  public searchAll(query: string): Observable<SearchResultItem[]> {
    const params = new HttpParams().set('query', query);
    return this.http.get<{ results: SearchResultItem[] }>(this.baseUrl, { params }).pipe(
      switchMap(res => of(res.results || []))
    );
  }
}
