import { inject, TestBed } from '@angular/core/testing';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { PersonService } from './person.service';
import { API_BASE_URL } from '../../../shared/constants/api.constants';
import { Person, PersonCredit, PersonImage, PersonSocials } from '../models/person.model';

describe('PersonService', () => {
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        PersonService,
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
      ],
    });

    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should fetch person details', inject([PersonService], (service: PersonService) => {
    const mockPerson: Person = {
      id: 1,
      name: 'John Doe',
      biography: 'A famous actor.',
      birthday: '1970-01-01',
      deathday: null,
      place_of_birth: 'Los Angeles',
      gender: 2,
      known_for_department: 'Acting',
      profile_path: '/profile.jpg',
      also_known_as: ['Johnny'],
      homepage: 'https://example.com'
    };

    service.getPersonDetails(1).subscribe(res => {
      expect(res).toEqual(mockPerson);
    });

    const req = httpMock.expectOne(`${API_BASE_URL}/person/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockPerson);
  }));

  it('should fetch person credits', inject([PersonService], (service: PersonService) => {
    const mockCredits: PersonCredit = {
      cast: [{ id: 1, title: 'Test Movie', character: 'Hero', poster_path:"", release_date:"" }],
    };

    service.getPersonCredits(1).subscribe(res => {
      expect(res).toEqual(mockCredits);
    });

    const req = httpMock.expectOne(`${API_BASE_URL}/person/1/movie_credits`);
    expect(req.request.method).toBe('GET');
    req.flush(mockCredits);
  }));

  it('should fetch person images', inject([PersonService], (service: PersonService) => {
    const mockImages: PersonImage = {
      profiles: [{ file_path: '/img.jpg', width: 500, height: 750 }]
    };

    service.getPersonImages(1).subscribe(res => {
      expect(res).toEqual(mockImages);
    });

    const req = httpMock.expectOne(`${API_BASE_URL}/person/1/images`);
    expect(req.request.method).toBe('GET');
    req.flush(mockImages);
  }));

  it('should fetch person socials', inject([PersonService], (service: PersonService) => {
    const mockSocials: PersonSocials = {
      imdb_id: 'nm0000001',
      facebook_id: 'john.doe',
      instagram_id: 'johnny_insta',
      twitter_id: 'johnny_tw',
      wikidata_id: 'Q12345',
      youtube_id: 'johnnyYT'
    };

    service.getPersonSocials(1).subscribe(res => {
      expect(res).toEqual(mockSocials);
    });

    const req = httpMock.expectOne(`${API_BASE_URL}/person/1/external_ids`);
    expect(req.request.method).toBe('GET');
    req.flush(mockSocials);
  }));
});
