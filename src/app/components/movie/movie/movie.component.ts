import { Component, HostListener, signal, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

import { Movie } from '../../../shared/models/movie.model';
import { WatchlistService } from '../../../shared/services/watch-list/watch-list.service';
import { Genre, GenreNames } from '../../../shared/models/genre.enum';
import { ErrorStateComponent } from '../../../shared/components/error-state/error-state.component';
import { LoadingStateComponent } from '../../../shared/components/loading-state/loading-state.component';
import { MovieService } from '../../../shared/services/movie/movie.service';

@Component({
  selector: 'app-movie',
  standalone: true,
  imports: [CommonModule, RouterModule, ErrorStateComponent, LoadingStateComponent],
  templateUrl: './movie.component.html',
  styleUrl: './movie.component.scss'
})
export class MovieComponent {
  movies: WritableSignal<Movie[]> = signal<Movie[]>([]);
  page: WritableSignal<number> = signal(1);
  selectedGenre: WritableSignal<Genre | string> = signal<Genre | string>("");
  bannerMovie: WritableSignal<Movie | null> = signal<Movie | null>(null);
  loadingMore: WritableSignal<boolean> = signal(false);
  isLoading: WritableSignal<boolean> = signal(false);
  error: WritableSignal<string> = signal<string>("");

  readonly Genre = Genre;
  readonly GenreNames = GenreNames; 

  constructor(
    public movieService: MovieService,
    public watchlist: WatchlistService,
    private router: Router
  ) {
    this.loadMovies();
  }

   selectGenre(genre: Genre) {
    this.selectedGenre.set(genre);
    this.page.set(1);
    this.movies.set([]);
    this.bannerMovie.set(null);
    this.loadMovies();
  }

  loadMovies() {
    if(!this.movies().length) {
      this.isLoading.set(true);
    }
    this.loadingMore.set(true);
    this.error.set("");

    const genreId: string | Genre = this.selectedGenre() || "";
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
        console.error('Error fetching movies', err);
        this.error.set('Oops! Something went wrong. Please try again.');
      },
      complete: () => {
        this.isLoading.set(false);
        this.loadingMore.set(false);
      }
    });
  }

  loadMore() {
    this.page.set(this.page() + 1);
    this.loadMovies();
  }

  getYear(date: string) {
    return date ? new Date(date).getFullYear() : '';
  }

  goToDetails(id: number) {
    this.router.navigate(['/movie', id]);
  }

  retryLoad() {
    // Reset to page 1 for clean state, or keep current page if you want.
    this.page.set(1);
    this.movies.set([]);
    this.bannerMovie.set(null);
    this.loadMovies();
  }

  /** ✅ ✅ ✅ AUTO LOAD MORE when scroll hits bottom */
  @HostListener('window:scroll', [])
  onScroll(): void {
    const scrollY = window.scrollY;
    const viewportHeight = window.innerHeight;
    const fullHeight = document.documentElement.scrollHeight;

    const buffer = 300; // px before bottom

    if (!this.loadingMore() && scrollY + viewportHeight + buffer >= fullHeight) {
      this.page.set(this.page() + 1);
      this.loadMovies();
    }
  }
}
