import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';

import { MovieDetailsComponent } from './movie-details.component';
import { MovieService } from '../../../shared/services/movie/movie.service';

xdescribe('MovieDetailsComponent', () => {
  let fixture: ComponentFixture<MovieDetailsComponent>;
  let component: MovieDetailsComponent;
  let movieServiceSpy: jasmine.SpyObj<MovieService>;

  beforeEach(() => {
    movieServiceSpy = jasmine.createSpyObj<MovieService>('MovieService', [
      'getMovieDetails',
      'getMovieVideos',
      'getMovieCredits',
      'getSimilarMovies',
      'getBackdropUrl',
      'getProfileUrl',
      'getPosterUrl'
    ]);

    movieServiceSpy.getBackdropUrl.and.callFake(() => 'mockBackdrop.jpg');
    movieServiceSpy.getProfileUrl.and.callFake(() => 'mockProfile.jpg');
    movieServiceSpy.getPosterUrl.and.callFake(() => 'mockPoster.jpg');

    TestBed.configureTestingModule({
      imports: [MovieDetailsComponent],
      providers: [
        { provide: MovieService, useValue: movieServiceSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of({
              get: (key: string) => '1'
            })
          }
        },
        {
          provide: DomSanitizer,
          useValue: {
            bypassSecurityTrustResourceUrl: (url: string) => url
          }
        }
      ]
    });

    fixture = TestBed.createComponent(MovieDetailsComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load movie details and related data successfully', fakeAsync(() => {
    const mockMovie = { id: 1, title: 'Sample Movie' } as any;

    const mockVideos = {
      id: 1,
      results: [
        { id: '1', type: 'Trailer', name: 'xyz', site: 'YouTube', key: 'abc123' }
      ]
    };

    const mockCredits = {
      id: 1,
      cast: Array(15).fill({ id: 1, name: 'Actor' }),
      crew: []
    };

    const mockSimilar = {
      page: 1,
      results: Array(10).fill({ id: 1, title: 'Similar Movie' }),
      total_pages: 1,
      total_results: 10
    };

    movieServiceSpy.getMovieDetails.and.returnValue(of(mockMovie));
    movieServiceSpy.getMovieVideos.and.returnValue(of(mockVideos));
    movieServiceSpy.getMovieCredits.and.returnValue(of(mockCredits));
    movieServiceSpy.getSimilarMovies.and.returnValue(of(mockSimilar));

    fixture.detectChanges();
    tick();

    expect(component.movie()).toEqual(mockMovie);
    expect(component.cast().length).toBe(10);
    expect(component.trailerUrl()).toContain('abc123');
    expect(component.similar().length).toBe(6);
    expect(component.loading()).toBeFalse();
  }));

  it('should set error if getMovieDetails fails', fakeAsync(() => {
    movieServiceSpy.getMovieDetails.and.returnValue(throwError(() => new Error('fail')));
    movieServiceSpy.getMovieVideos.and.returnValue(of({ id: 1, results: [] }));
    movieServiceSpy.getMovieCredits.and.returnValue(of({ id: 1, cast: [], crew: [] }));
    movieServiceSpy.getSimilarMovies.and.returnValue(of({
      page: 1,
      results: [],
      total_pages: 1,
      total_results: 0
    }));

    fixture.detectChanges();
    tick();

    expect(component.error()).toBe('Failed to load movie details.');
    expect(component.loading()).toBeFalse();
  }));

  it('should generate a null trailerUrl if no YouTube trailer found', fakeAsync(() => {
    const mockMovie = { id: 1, title: 'Sample' } as any;
    const mockVideos = {
      id: 1,
      results: [
        { id: '1', type: 'Clip', name: 'xyz', site: 'YouTube', key: 'notatrailer' }
      ]
    };

    movieServiceSpy.getMovieDetails.and.returnValue(of(mockMovie));
    movieServiceSpy.getMovieVideos.and.returnValue(of(mockVideos));
    movieServiceSpy.getMovieCredits.and.returnValue(of({ id: 1, cast: [], crew: [] }));
    movieServiceSpy.getSimilarMovies.and.returnValue(of({
      page: 1,
      results: [],
      total_pages: 1,
      total_results: 0
    }));

    fixture.detectChanges();
    tick();

    expect(component.trailerUrl()).toBeNull();
  }));

  it('should handle empty credits and similar movies', fakeAsync(() => {
    const mockMovie = { id: 1, title: 'Sample Movie' } as any;

    movieServiceSpy.getMovieDetails.and.returnValue(of(mockMovie));
    movieServiceSpy.getMovieVideos.and.returnValue(of({ id: 1, results: [] }));
    movieServiceSpy.getMovieCredits.and.returnValue(of({ id: 1, cast: [], crew: [] }));
    movieServiceSpy.getSimilarMovies.and.returnValue(of({
      page: 1,
      results: [],
      total_pages: 1,
      total_results: 0
    }));

    fixture.detectChanges();
    tick();

    expect(component.cast().length).toBe(0);
    expect(component.similar().length).toBe(0);
    expect(component.trailerUrl()).toBeNull();
    expect(component.loading()).toBeFalse(); 
  }));

});
