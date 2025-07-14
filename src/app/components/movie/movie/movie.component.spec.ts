import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { MovieComponent } from './movie.component';
import { MovieService } from '../../../shared/services/movie/movie.service';
import { WatchlistService } from '../../../shared/services/watch-list/watch-list.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { Genre } from '../../../shared/models/genre.enum';
import { By } from '@angular/platform-browser';

describe('MovieComponent', () => {
  let component: MovieComponent;
  let fixture: ComponentFixture<MovieComponent>;
  let movieServiceSpy: jasmine.SpyObj<MovieService>;
  let watchlistServiceSpy: jasmine.SpyObj<WatchlistService>;
  let routerSpy: jasmine.SpyObj<Router>;

  const mockMovies = [
    { id: 1, title: 'Test Movie', poster_path: '/poster.jpg', release_date: '2020-01-01', vote_average: 7.5, overview: 'Overview here' },
    { id: 2, title: 'Another Movie', poster_path: '/poster2.jpg', release_date: '2021-01-01', vote_average: 8.0, overview: 'Overview here' }
  ];

  beforeEach(async () => {
    movieServiceSpy = jasmine.createSpyObj('MovieService', ['discoverMovies', 'getPosterUrl']);
    watchlistServiceSpy = jasmine.createSpyObj('WatchlistService', ['toggle', 'isInWatchlist']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    movieServiceSpy.discoverMovies.and.returnValue(of({ results: mockMovies }));
    movieServiceSpy.getPosterUrl.and.returnValue('http://image.tmdb.org/t/p/w500/poster.jpg');
    watchlistServiceSpy.isInWatchlist.and.returnValue(false);

    await TestBed.configureTestingModule({
      imports: [MovieComponent],
      providers: [
        { provide: MovieService, useValue: movieServiceSpy },
        { provide: WatchlistService, useValue: watchlistServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MovieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call loadMovies on init and populate movies', fakeAsync(() => {
    expect(component.movies().length).toBeGreaterThan(0);
    expect(movieServiceSpy.discoverMovies).toHaveBeenCalled();
  }));

  it('should get poster url', () => {
    const url = component.getPosterUrl('/path.jpg');
    expect(url).toContain('http');
  });

  it('should return correct year', () => {
    expect(component.getYear('2020-05-20')).toBe('2020');
  });

  it('should navigate to movie details', () => {
    component.goToDetails(1);
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/movie', 1]);
  });

  it('should retry load', fakeAsync(() => {
    movieServiceSpy.discoverMovies.and.returnValue(of({ results: mockMovies }));
    component.retryLoad();
    tick();
    expect(component.movies().length).toBeGreaterThan(0);
  }));

  it('should handle loadMovies error', fakeAsync(() => {
    movieServiceSpy.discoverMovies.and.returnValue(throwError(() => new Error('API Error')));
    component.retryLoad();
    tick();
    expect(component.error()).toContain('Oops');
  }));

  it('should select genre and reload', fakeAsync(() => {
    component.selectGenre(Genre.ACTION);
    tick();
    expect(component.selectedGenre()).toBe(Genre.ACTION);
    expect(movieServiceSpy.discoverMovies).toHaveBeenCalledWith(Genre.ACTION, 1);
  }));

  it('should load more movies on loadMore', fakeAsync(() => {
    const oldLength = component.movies().length;
    component.loadMore();
    tick();
    expect(component.movies().length).toBeGreaterThan(oldLength);
  }));

  it('should handle scroll and load more when near bottom', fakeAsync(() => {
    spyOn(component, 'loadMore');
    spyOnProperty(window, 'scrollY').and.returnValue(1000);
    spyOnProperty(window, 'innerHeight').and.returnValue(800);
    spyOnProperty(document.documentElement, 'scrollHeight').and.returnValue(1500);

    component.onScroll();
    expect(component.loadMore).toHaveBeenCalled();
  }));

  it('should toggle watchlist for each movie', () => {
    component.movies.set(mockMovies);
    fixture.detectChanges();

    const toggleBtns = fixture.debugElement.queryAll(By.css('.absolute.top-2.right-2'));
    expect(toggleBtns.length).toBe(mockMovies.length);

    toggleBtns[0].triggerEventHandler('click', { stopPropagation: () => {} });
    expect(watchlistServiceSpy.toggle).toHaveBeenCalledWith(mockMovies[0]);

    toggleBtns[1].triggerEventHandler('click', { stopPropagation: () => {} });
    expect(watchlistServiceSpy.toggle).toHaveBeenCalledWith(mockMovies[1]);
  });


  it('should render genre buttons and apply active classes', () => {
    fixture.detectChanges();
    const genreButtons = fixture.debugElement.queryAll(By.css('button'));

    expect(genreButtons.length).toBeGreaterThan(0);

    const actionBtn = genreButtons.find(b => b.nativeElement.textContent.includes('Action Fix'));
    actionBtn!.triggerEventHandler('click');

    expect(component.selectedGenre()).toBe(Genre.ACTION);
  });
});
