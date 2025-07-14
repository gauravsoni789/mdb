import { TestBed, inject } from '@angular/core/testing';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';

import { MovieService } from './movie.service';
import { API_BASE_URL, IMAGE_BASE_URL, IMAGE_ORIGINAL_URL } from '../../constants/api.constants';

describe('MovieService', () => {
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        MovieService,
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
      ],
    });

    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should call getMovieDetails with correct URL', inject([MovieService], (service: MovieService) => {
    const mockMovie = {
    id: 1,
    title: 'Test Movie',
    overview: 'A test overview',
    release_date: '2024-01-01',
    vote_average: 8,
    poster_path: '/test.jpg',
    backdrop_path: '/backdrop.jpg'
  };;

    service.getMovieDetails(1).subscribe(res => {
      expect(res).toEqual(mockMovie);
    });

    const req = httpMock.expectOne(`${API_BASE_URL}/movie/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockMovie);
  }));

  it('should call getMovieCredits with correct URL', inject([MovieService], (service: MovieService) => {
    const mockCredits = { id: 1, cast: [], crew: [] };

    service.getMovieCredits(1).subscribe(res => {
      expect(res).toEqual(mockCredits);
    });

    const req = httpMock.expectOne(`${API_BASE_URL}/movie/1/credits`);
    expect(req.request.method).toBe('GET');
    req.flush(mockCredits);
  }));

  it('should call getMovieVideos with correct URL', inject([MovieService], (service: MovieService) => {
    const mockVideos = { id: 1, results: [] };

    service.getMovieVideos(1).subscribe(res => {
      expect(res).toEqual(mockVideos);
    });

    const req = httpMock.expectOne(`${API_BASE_URL}/movie/1/videos`);
    expect(req.request.method).toBe('GET');
    req.flush(mockVideos);
  }));

  it('should call getSimilarMovies with correct URL', inject([MovieService], (service: MovieService) => {
    const mockSimilar = {
      page: 1,
      results: [],
      total_pages: 1,
      total_results: 0
    };

    service.getSimilarMovies(1).subscribe(res => {
      expect(res).toEqual(mockSimilar);
    });

    const req = httpMock.expectOne(`${API_BASE_URL}/movie/1/similar`);
    expect(req.request.method).toBe('GET');
    req.flush(mockSimilar);
  }));

  it('should call discoverMovies with genreId and page', inject([MovieService], (service: MovieService) => {
    const mockDiscover = { results: [] };

    service.discoverMovies('28', 2).subscribe(res => {
      expect(res).toEqual(mockDiscover);
    });

    const req = httpMock.expectOne(
      `${API_BASE_URL}/discover/movie?with_genres=28&page=2`
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockDiscover);
  }));

  it('should return correct backdrop URL', inject([MovieService], (service: MovieService) => {
    const path = '/backdrop.jpg';
    expect(service.getBackdropUrl(path)).toBe(`${IMAGE_ORIGINAL_URL}${path}`);
    expect(service.getBackdropUrl(undefined)).toBe('');
  }));

  it('should return correct poster URL', inject([MovieService], (service: MovieService) => {
    const path = '/poster.jpg';
    expect(service.getPosterUrl(path)).toBe(`${IMAGE_BASE_URL}${path}`);
  }));

  it('should return correct profile URL', inject([MovieService], (service: MovieService) => {
    const path = '/profile.jpg';
    expect(service.getProfileUrl(path)).toBe(`${IMAGE_BASE_URL}${path}`);
    expect(service.getProfileUrl(undefined)).toBe('');
  }));
});
