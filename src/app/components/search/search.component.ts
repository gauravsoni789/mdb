import { Component, EventEmitter, Output, WritableSignal, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Subject, of } from 'rxjs';
import { SearchService } from './services/search.service';
import { PopoverModule } from 'primeng/popover';
import { GroupedSearchResult, SearchResultItem } from './models/search-result.model';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, AutoCompleteModule, FormsModule, PopoverModule],
  templateUrl: './search.component.html',
})
export class SearchComponent {
  @Output() private toggleEvent: EventEmitter<boolean> = new EventEmitter<boolean>(false);

  public error: WritableSignal<string> = signal<string>('');
  public filteredResults: WritableSignal<GroupedSearchResult[]> = signal<GroupedSearchResult[]>([]);
  public loading: WritableSignal<boolean> = signal<boolean>(false);
  public query: WritableSignal<string> = signal<string>('');

  private searchInput$ = new Subject<string>();

  constructor(private searchService: SearchService, private router: Router) {
    this.searchInput$
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap(term => {
          if (!term.trim()) {
            this.filteredResults.set([]);
            return of([]);
          }
          this.loading.set(true);
          this.error.set('');
          return this.searchService.searchAll(term);
        })
      )
      .subscribe({
        next: (res: SearchResultItem[]) => {
          const movieData: GroupedSearchResult = {
            label: 'MOVIE',
            value: 'movie',
            items: res.filter(item => item.media_type === 'movie'),
          };

          const personData: GroupedSearchResult = {
            label: 'PERSON',
            value: 'person',
            items: res.filter(item => item.media_type === 'person'),
          };

          const groupData: GroupedSearchResult[] = [];
          if (movieData.items.length) groupData.push(movieData);
          if (personData.items.length) groupData.push(personData);

          this.filteredResults.set(groupData);
        },
        error: err => {
          console.error(err);
          this.error.set('Failed to fetch search results.');
        },
        complete: () => this.loading.set(false),
      });
  }

  public search(event: { query: string }): void {
    this.searchInput$.next(event.query);
  }

  public selectItem(item: { value: SearchResultItem }): void {
    this.toggleEvent.emit(true);

    if (item.value.media_type === 'movie') {
      this.router.navigate(['/movie', item.value.id]);
    } else if (item.value.media_type === 'person') {
      this.router.navigate(['/person', item.value.id]);
    }

    this.query.set('');
  }

  public retry(): void {
    this.searchInput$.next(this.query());
  }
}
