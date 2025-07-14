import { Component, WritableSignal, signal } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { WatchlistService } from '../../../shared/services/watch-list/watch-list.service';
import { LoadingStateComponent } from '../../../shared/components/loading-state/loading-state.component';
import { ErrorStateComponent } from '../../../shared/components/error-state/error-state.component';
import { Movie, Cast } from '../../../shared/models/movie.model';
import { MovieService } from '../../../shared/services/movie/movie.service';
import { CarouselModule } from 'primeng/carousel';
import { YOUTUBE_EMBED_URL } from '../../../shared/constants/api.constants';

@Component({
  standalone: true,
  selector: 'app-movie-details',
  imports: [CommonModule, RouterModule, LoadingStateComponent, ErrorStateComponent, CarouselModule],
  templateUrl: './movie-details.component.html',
})
export class MovieDetailsComponent {

  public cast: WritableSignal<Cast[]> = signal([]);
  public error: WritableSignal<string> = signal('');
  public loading: WritableSignal<boolean> = signal(true);
  public movie: WritableSignal<Movie | null> = signal(null);
  public similar: WritableSignal<Movie[]> = signal([]);
  public trailerUrl: WritableSignal<SafeResourceUrl | null> = signal(null);

  constructor(
    private route: ActivatedRoute,
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

  public toggleWatchlist(movie: Movie): void {
    this.watchlist.toggle(movie);
  }

  private loadMovie(id: number): void {
    this.loading.set(true);
    this.error.set('');

    let tasks = 0;
    const done = () => {
      tasks++;
      if (tasks === 4) {
        this.loading.set(false);
      }
    };

    this.movieService.getMovieDetails(id).subscribe({
      next: movie => this.movie.set(movie),
      error: () => this.error.set('Failed to load movie details.'),
      complete: done
    });

    this.movieService.getMovieVideos(id).subscribe({
      next: res => {
        const trailer = res.results.find(v => v.type === 'Trailer' && v.site === 'YouTube');
        this.trailerUrl.set(trailer ? this.sanitizer.bypassSecurityTrustResourceUrl(
          `${YOUTUBE_EMBED_URL}${trailer.key}`
        ) : null);
      },
      complete: done
    });

    this.movieService.getMovieCredits(id).subscribe({
      next: res => this.cast.set(res.cast.slice(0, 10)),
      complete: done
    });

    this.movieService.getSimilarMovies(id).subscribe({
      next: res => this.similar.set(res.results.slice(0, 6)),
      complete: done
    });
  }
}
