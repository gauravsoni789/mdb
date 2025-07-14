import { Injectable } from '@angular/core';
import { Movie } from '../../models/movie.model';

@Injectable({ providedIn: 'root' })

export class WatchlistService {
  private key = 'my_watchlist';

  getWatchlist(): Movie[] {
    return JSON.parse(localStorage.getItem(this.key) || '[]');
  }

  isInWatchlist(movie: Movie): boolean {
    return this.getWatchlist().some((m) => m.id === movie.id);
  }

  add(movie: Movie) {
    const list = this.getWatchlist();
    list.push(movie);
    localStorage.setItem(this.key, JSON.stringify(list));
  }

  remove(movie: Movie) {
    const list = this.getWatchlist().filter((m) => m.id !== movie.id);
    localStorage.setItem(this.key, JSON.stringify(list));
  }

  toggle(movie: Movie) {
    this.isInWatchlist(movie) ? this.remove(movie) : this.add(movie);
  }
}
