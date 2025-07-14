import { Injectable } from '@angular/core';
import { Movie } from '../../models/movie.model';
import { WATCHLIST } from '../../constants/api.constants';

@Injectable({ providedIn: 'root' })

export class WatchlistService {
  private key = WATCHLIST;

  public add(movie: Movie): void {
    const list = this.getWatchlist();
    list.push(movie);
    localStorage.setItem(this.key, JSON.stringify(list));
  }

  public getWatchlist(): Movie[] {
    return JSON.parse(localStorage.getItem(this.key) || '[]');
  }

  public isInWatchlist(movie: Movie): boolean {
    return this.getWatchlist().some((m) => m.id === movie.id);
  }

  public remove(movie: Movie): void {
    const list = this.getWatchlist().filter((m) => m.id !== movie.id);
    localStorage.setItem(this.key, JSON.stringify(list));
  }

  public toggle(movie: Movie): void {
    this.isInWatchlist(movie) ? this.remove(movie) : this.add(movie);
  }
}
