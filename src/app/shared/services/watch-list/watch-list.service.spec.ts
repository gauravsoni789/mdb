import { TestBed } from '@angular/core/testing';
import { Movie } from '../../models/movie.model';
import { WatchlistService } from './watch-list.service';

describe('WatchlistService', () => {
  let service: WatchlistService;
  const mockMovie: Movie = {
    id: 1,
    title: 'Test Movie',
    overview: 'A test overview',
    release_date: '2024-01-01',
    vote_average: 8,
    poster_path: '/test.jpg',
    backdrop_path: '/backdrop.jpg'
  };

  const anotherMovie: Movie = {
    id: 2,
    title: 'Another Movie',
    overview: 'Another test overview',
    release_date: '2023-01-01',
    vote_average: 7,
    poster_path: '/another.jpg',
    backdrop_path: '/another-backdrop.jpg'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WatchlistService);
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should add a movie to watchlist', () => {
    expect(service.getWatchlist().length).toBe(0);
    service.add(mockMovie);
    const list = service.getWatchlist();
    expect(list.length).toBe(1);
    expect(list[0].id).toBe(mockMovie.id);
  });

  it('should remove a movie from watchlist', () => {
    service.add(mockMovie);
    service.remove(mockMovie);
    expect(service.getWatchlist().length).toBe(0);
  });

  it('should not remove a movie that does not exist', () => {
    service.add(mockMovie);
    service.remove(anotherMovie); // does not exist in watchlist
    expect(service.getWatchlist().length).toBe(1);
  });

  it('should check if a movie is in watchlist', () => {
    service.add(mockMovie);
    expect(service.isInWatchlist(mockMovie)).toBeTrue();
    expect(service.isInWatchlist(anotherMovie)).toBeFalse();
  });

  it('should toggle movie correctly (add if not exists)', () => {
    expect(service.isInWatchlist(mockMovie)).toBeFalse();
    service.toggle(mockMovie);
    expect(service.isInWatchlist(mockMovie)).toBeTrue();
  });

  it('should toggle movie correctly (remove if exists)', () => {
    service.add(mockMovie);
    expect(service.isInWatchlist(mockMovie)).toBeTrue();
    service.toggle(mockMovie);
    expect(service.isInWatchlist(mockMovie)).toBeFalse();
  });

  it('should handle multiple movies', () => {
    service.add(mockMovie);
    service.add(anotherMovie);
    const list = service.getWatchlist();
    expect(list.length).toBe(2);
    expect(list.some(m => m.id === mockMovie.id)).toBeTrue();
    expect(list.some(m => m.id === anotherMovie.id)).toBeTrue();
  });

  it('should persist to localStorage correctly', () => {
    service.add(mockMovie);
    const stored = JSON.parse(localStorage.getItem('my_watchlist') || '[]');
    expect(stored.length).toBe(1);
    expect(stored[0].id).toBe(mockMovie.id);
  });

  it('should return empty list if no data in localStorage', () => {
    localStorage.removeItem('my_watchlist');
    const list = service.getWatchlist();
    expect(Array.isArray(list)).toBeTrue();
    expect(list.length).toBe(0);
  });

  it('should not duplicate movies when adding same movie multiple times', () => {
    service.add(mockMovie);
    service.add(mockMovie);
    const list = service.getWatchlist();
    expect(list.length).toBe(2);
  });
});
