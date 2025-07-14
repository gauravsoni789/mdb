import { Component, signal, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { Movie } from '../../shared/models/movie.model';
import { WatchlistService } from '../../shared/services/watch-list/watch-list.service';
import { LoadingStateComponent } from '../../shared/components/loading-state/loading-state.component';
import { ErrorStateComponent } from '../../shared/components/error-state/error-state.component';

@Component({
  selector: 'app-watch-list',
  imports: [CommonModule, RouterModule, LoadingStateComponent, ErrorStateComponent],
  templateUrl: './watch-list.component.html',
  styleUrl: './watch-list.component.scss'
})
export class WatchListComponent {
  
  public error: WritableSignal<string> = signal<string>("");
  public movies: WritableSignal<Movie[]> = signal<Movie[]>([]);
  public loading: WritableSignal<boolean> = signal(true);

  constructor(
    public watchlist: WatchlistService,
    private router: Router
  ) {
    this.load();
  }

  public goToDetails(id: number): void {
    this.router.navigate(['/movie', id]);
  }

  public remove(movie: Movie): void {
    this.watchlist.remove(movie);
    this.load(); // reload after removing
  }

  public retryLoad(): void {
    this.load();
  }

  private load(): void {
    this.loading.set(true);
    this.error.set("");
    try {
      const items = this.watchlist.getWatchlist();
      this.movies.set(items);
    } catch (err) {
      console.error(err);
      this.error.set('Failed to load watchlist.');
    } finally {
      this.loading.set(false);
    }
  }
}
