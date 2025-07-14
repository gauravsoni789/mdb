import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WatchListComponent } from './watch-list.component';
import { Router } from '@angular/router';
import { WatchlistService } from '../../shared/services/watch-list/watch-list.service';
import { Movie } from '../../shared/models/movie.model';
import { LoadingStateComponent } from '../../shared/components/loading-state/loading-state.component';
import { ErrorStateComponent } from '../../shared/components/error-state/error-state.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

describe('WatchListComponent', () => {
  let component: WatchListComponent;
  let fixture: ComponentFixture<WatchListComponent>;
  let watchlistServiceSpy: jasmine.SpyObj<WatchlistService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    watchlistServiceSpy = jasmine.createSpyObj('WatchlistService', ['getWatchlist', 'remove']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    watchlistServiceSpy.getWatchlist.and.returnValue([
      { id: 1, title: 'Movie 1' } as Movie,
      { id: 2, title: 'Movie 2' } as Movie
    ]);

    await TestBed.configureTestingModule({
      imports: [CommonModule, RouterModule, LoadingStateComponent, ErrorStateComponent],
      providers: [
        { provide: WatchlistService, useValue: watchlistServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(WatchListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.movies().length).toBe(2);
  });

  it('should navigate to movie details', () => {
    component.goToDetails(123);
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/movie', 123]);
  });

  it('should remove movie and reload', () => {
    const mockMovie: Movie = { id: 2, title: 'Remove Me' } as Movie;

    let mockList: Movie[] = [mockMovie];
    watchlistServiceSpy.getWatchlist.and.callFake(() => mockList);
    watchlistServiceSpy.remove.and.callFake((movie: Movie) => {
      mockList = mockList.filter(m => m.id !== movie.id);
    });

    component.retryLoad();
    expect(component.movies()).toEqual([mockMovie]);

    component.remove(mockMovie);
    expect(watchlistServiceSpy.remove).toHaveBeenCalledWith(mockMovie);
    expect(component.movies()).toEqual([]);
  });

  it('should handle errors when loading watchlist', () => {
    watchlistServiceSpy.getWatchlist.and.throwError('Failed');

    component.retryLoad();

    expect(component.error()).toBe('Failed to load watchlist.');
    expect(component.loading()).toBeFalse();
  });

  it('should retry load', () => {
    component.retryLoad();
    expect(component.movies().length).toBe(2);
  });
});
