import { Component, HostListener, signal, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

import { Movie } from '../../../shared/models/movie.model';
import { Genre, GenreNames } from '../../../shared/models/genre.enum';
import { WatchlistService } from '../../../shared/services/watch-list/watch-list.service';
import { MovieService } from '../../../shared/services/movie/movie.service';
import { ErrorStateComponent } from '../../../shared/components/error-state/error-state.component';
import { LoadingStateComponent } from '../../../shared/components/loading-state/loading-state.component';

@Component({
  selector: 'app-movie',
  standalone: true,
  imports: [CommonModule, RouterModule, ErrorStateComponent, LoadingStateComponent],
  templateUrl: './movie.component.html',
  styleUrl: './movie.component.scss'
})
export class MovieComponent {

  public bannerMovie: WritableSignal<Movie | null> = signal<Movie | null>(null);
  public error: WritableSignal<string> = signal<string>('');
  public isLoading: WritableSignal<boolean> = signal(false);
  public loadingMore: WritableSignal<boolean> = signal(false);
  public movies: WritableSignal<Movie[]> = signal<Movie[]>([]);
  public page: WritableSignal<number> = signal(1);
  public selectedGenre: WritableSignal<Genre | ''> = signal<Genre | ''>('');

  public readonly Genre = Genre;
  public readonly GenreNames = GenreNames;

  constructor(
    public movieService: MovieService,
    public watchlist: WatchlistService,
    private router: Router
  ) {
    this.loadMovies();
  }

  public getPosterUrl(path: string | undefined): string {
    return path ? this.movieService.getPosterUrl(path) : '';
  }

  public getYear(date: string): string {
    return date ? new Date(date).getFullYear().toString() : '';
  }

  public goToDetails(id: number): void {
    this.router.navigate(['/movie', id]);
  }

  public loadMore(): void {
    this.page.set(this.page() + 1);
    this.loadingMore.set(true);
    this.loadMovies();
  }

  public retryLoad(): void {
    this.page.set(1);
    this.movies.set([]);
    this.bannerMovie.set(null);
    this.loadMovies();
  }

  public selectGenre(genre: Genre): void {
    this.selectedGenre.set(genre);
    this.page.set(1);
    this.movies.set([]);
    this.bannerMovie.set(null);
    this.loadMovies();
  }

  private loadMovies(): void {
    if (!this.movies().length) {
      this.isLoading.set(true);
    }

    this.error.set('');

    const genreId: Genre | '' = this.selectedGenre() || '';
    this.movieService.discoverMovies(genreId, this.page()).subscribe({
      next: res => {
        const newMovies = [...this.movies(), ...res.results];
        this.movies.set(newMovies);

        if (this.page() === 1 && res.results.length > 0) {
          const randomIndex = Math.floor(Math.random() * res.results.length);
          this.bannerMovie.set(res.results[randomIndex]);
        }
      },
      error: err => {
        console.error('Error fetching movies:', err);
        this.error.set('Oops! Something went wrong. Please try again.');
      },
      complete: () => {
        this.isLoading.set(false);
        this.loadingMore.set(false);
      }
    });
  }

  @HostListener('window:scroll', [])
  onScroll(): void {
    const scrollY = window.scrollY;
    const viewportHeight = window.innerHeight;
    const fullHeight = document.documentElement.scrollHeight;

    const buffer = 300;
    if (!this.loadingMore() && scrollY + viewportHeight + buffer >= fullHeight) {
      this.loadMore();
    }
  }
}
