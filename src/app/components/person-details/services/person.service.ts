import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_BASE_URL } from '../../../shared/constants/api.constants';
import { Person, PersonCredit, PersonImage, PersonSocials } from '../models/person.model';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PersonService {

  constructor(private http: HttpClient) {}

  public getPersonCredits(id: number): Observable<PersonCredit> {
    return this.http.get<PersonCredit>(`${API_BASE_URL}/person/${id}/movie_credits`);
  }

  public getPersonDetails(id: number): Observable<Person> {
    return this.http.get<Person>(`${API_BASE_URL}/person/${id}`);
  }

  public getPersonImages(id: number): Observable<PersonImage> {
    return this.http.get<PersonImage>(`${API_BASE_URL}/person/${id}/images`);
  }

  public getPersonSocials(id: number): Observable<PersonSocials> {
    return this.http.get<PersonSocials>(`${API_BASE_URL}/person/${id}/external_ids`);
  }
}
