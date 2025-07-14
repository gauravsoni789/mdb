import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_BASE_URL } from '../../../shared/constants/api.constants';

@Injectable({ providedIn: 'root' })
export class PersonService {

  constructor(private http: HttpClient) {}

  getPersonDetails(id: number) {
    return this.http.get(`${API_BASE_URL}/person/${id}`);
  }

  getPersonCredits(id: number) {
    return this.http.get<{ cast: any[] }>(`${API_BASE_URL}/person/${id}/movie_credits`);
  }

  getPersonImages(id: number) {
    return this.http.get<{ profiles: any[] }>(`${API_BASE_URL}/person/${id}/images`);
  }

  getPersonSocials(id: number) {
    return this.http.get(`${API_BASE_URL}/person/${id}/external_ids`);
  }
}
