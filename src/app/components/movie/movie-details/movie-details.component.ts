import { Component, WritableSignal, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { WatchlistService } from '../../../shared/services/watch-list/watch-list.service';
import { LoadingStateComponent } from '../../../shared/components/loading-state/loading-state.component';
import { ErrorStateComponent } from '../../../shared/components/error-state/error-state.component';
import { Movie } from '../../../shared/models/movie.model';
import { MovieService } from '../../../shared/models/services/movie.service';
import { CarouselModule } from 'primeng/carousel';

@Component({
  standalone: true,
  selector: 'app-movie-details',
  imports: [CommonModule, RouterModule, LoadingStateComponent, ErrorStateComponent, CarouselModule],
  templateUrl: './movie-details.component.html',
})
export class MovieDetailsComponent {
  movie: WritableSignal<Movie | null> = signal(null);
  trailerUrl: WritableSignal<SafeResourceUrl | null> = signal(null);
  cast: WritableSignal<any[]> = signal([]);
  similar: WritableSignal<Movie[]> = signal([]);
  loading: WritableSignal<boolean> = signal(true);
  error: WritableSignal<string> = signal("");

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public movieService: MovieService,
    public watchlist: WatchlistService,
    private sanitizer: DomSanitizer
  ) {
    this.route.paramMap.subscribe(params => {
      const id = Number(params.get('id'));
      if (id) {
        this.loadMovie(id);
      } else {
        this.error.set('No movie ID provided.');
        this.loading.set(false);
      }
    });
  }

  loadMovie(id: number) {
    this.loading.set(true);
    this.error.set("");

    this.movieService.getMovieDetails(id).subscribe({
      next: movie => this.movie.set(movie),
      error: err => {
        this.error.set('Failed to load movie.');
      }
    });

    this.movieService.getMovieVideos(id).subscribe({
      next: res => {
        const trailer = res.results.find((v: any) => v.type === 'Trailer' && v.site === 'YouTube');
        if (trailer) {
          this.trailerUrl.set(this.sanitizer.bypassSecurityTrustResourceUrl(
            `https://www.youtube.com/embed/${trailer.key}`
          ));
        } else {
          this.trailerUrl.set(null);
        }
      }
    });

    this.movieService.getMovieCredits(id).subscribe({
      next: res => this.cast.set(res.cast.slice(0, 10))
    });

    this.movieService.getSimilarMovies(id).subscribe({
      next: res => this.similar.set(res.results.slice(0, 6))
    });

    this.loading.set(false);
  }

  toggleWatchlist(movie: Movie) {
    this.watchlist.toggle(movie);
  }

}
