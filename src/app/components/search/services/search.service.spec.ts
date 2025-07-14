import { inject, TestBed } from '@angular/core/testing';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { SearchService } from './search.service';
import { API_BASE_URL } from '../../../shared/constants/api.constants';
import { SearchResultItem } from '../models/search-result.model';

describe('SearchService', () => {
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SearchService,
        provideHttpClient(withInterceptorsFromDi()), 
        provideHttpClientTesting()
      ],
    });

    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should call the correct URL with query param', inject([SearchService], (service: SearchService) => {
    const mockResults: SearchResultItem[] = [{ id: 1, title: 'Test Movie' } as SearchResultItem];

    service.searchAll('batman').subscribe(results => {
      expect(results).toEqual(mockResults);
    });

    const req = httpMock.expectOne(`${API_BASE_URL}/search/multi?query=batman`);
    expect(req.request.method).toBe('GET');
    req.flush({ results: mockResults });
  }));

  it('should return an empty array if results is null', inject([SearchService], (service: SearchService) => {
    service.searchAll('joker').subscribe(results => {
      expect(results).toEqual([]);
    });

    const req = httpMock.expectOne(`${API_BASE_URL}/search/multi?query=joker`);
    req.flush({ results: null });
  }));

  it('should return an empty array if results is undefined', inject([SearchService], (service: SearchService) => {
    service.searchAll('joker').subscribe(results => {
      expect(results).toEqual([]);
    });

    const req = httpMock.expectOne(`${API_BASE_URL}/search/multi?query=joker`);
    req.flush({});
  }));
});
