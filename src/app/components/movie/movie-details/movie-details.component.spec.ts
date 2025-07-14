import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';

import { MovieDetailsComponent } from './movie-details.component';
import { MovieService } from '../../../shared/services/movie/movie.service';
import { WatchlistService } from '../../../shared/services/watch-list/watch-list.service';

describe('MovieDetailsComponent', () => {
  let component: MovieDetailsComponent;
  let fixture: ComponentFixture<MovieDetailsComponent>;
  let movieServiceSpy: jasmine.SpyObj<MovieService>;
  let watchlistSpy: jasmine.SpyObj<WatchlistService>;
  let sanitizerSpy: jasmine.SpyObj<DomSanitizer>;

  const mockMovie = {
    id: 1,
    title: 'Test Movie',
    poster_path: '/poster.jpg',
    backdrop_path: '/backdrop.jpg',
    release_date: '2020-01-01',
    vote_average: 7.5,
    overview: 'Overview here'
  };

  const mockVideos = {
    id: 1,
    results: [
      { id: '1', type: 'Trailer', name: 'Trailer', site: 'YouTube', key: 'abc123' }
    ]
  };
  const noTrailer = {
    id: 1,
    results: [
      { id: '1', type: 'Clip', name: 'Trailer', site: 'YouTube', key: 'notatrailer' }
    ]
  };

  const mockCredits = {
    id: 1,
    cast: Array(15).fill({ id: 1, name: 'Actor' }),
    crew: []
  };

  const mockSimilar = {
    page: 1,
    results: Array(10).fill({ id: 2, title: 'Similar Movie' }),
    total_pages: 1,
    total_results: 10
  };

  beforeEach(async () => {
    movieServiceSpy = jasmine.createSpyObj('MovieService', [
      'getMovieDetails',
      'getMovieVideos',
      'getMovieCredits',
      'getSimilarMovies',
      'getBackdropUrl',
      'getPosterUrl'
    ]);
    watchlistSpy = jasmine.createSpyObj('WatchlistService', ['toggle']);
    sanitizerSpy = jasmine.createSpyObj('DomSanitizer', ['bypassSecurityTrustResourceUrl']);

    movieServiceSpy.getMovieDetails.and.returnValue(of(mockMovie));
    movieServiceSpy.getMovieVideos.and.returnValue(of(mockVideos));
    movieServiceSpy.getMovieCredits.and.returnValue(of(mockCredits));
    movieServiceSpy.getSimilarMovies.and.returnValue(of(mockSimilar));
    movieServiceSpy.getBackdropUrl.and.returnValue('backdrop_url');
    movieServiceSpy.getPosterUrl.and.returnValue('poster_url');
    sanitizerSpy.bypassSecurityTrustResourceUrl.and.returnValue('safe_url');

    await TestBed.configureTestingModule({
      imports: [MovieDetailsComponent],
      providers: [
        { provide: MovieService, useValue: movieServiceSpy },
        { provide: WatchlistService, useValue: watchlistSpy },
        { provide: DomSanitizer, useValue: sanitizerSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of(new Map([['id', '1']]))
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MovieDetailsComponent);
    component = fixture.componentInstance;
  });

  it('should toggle watchlist', () => {
    component.toggleWatchlist(mockMovie as any);
    expect(watchlistSpy.toggle).toHaveBeenCalledWith(mockMovie);
  });

  it('should handle missing ID in route', () => {
    const route = TestBed.inject(ActivatedRoute) as any;
    route.paramMap = of(new Map([['id', null]]));
    const newFixture = TestBed.createComponent(MovieDetailsComponent);
    const newComponent = newFixture.componentInstance;
    newFixture.detectChanges();

    expect(newComponent.error()).toBe('No movie ID provided.');
    expect(newComponent.loading()).toBeFalse();
  });

  it('should handle movie details load error', fakeAsync(() => {
    movieServiceSpy.getMovieDetails.and.returnValue(throwError(() => new Error('Error!')));
    fixture = TestBed.createComponent(MovieDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    tick();

    expect(component.error()).toBe('Failed to load movie details.');
    expect(component.loading()).toBeTrue(); // until other calls complete
  }));

});
