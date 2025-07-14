import { Component, EventEmitter, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {  AutoCompleteModule } from 'primeng/autocomplete';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Subject, of } from 'rxjs';
import { SearchService } from './services/search.service';
import { PopoverModule } from 'primeng/popover';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, AutoCompleteModule, FormsModule, PopoverModule],
  templateUrl: './search.component.html',
})
export class SearchComponent {
  @Output() toggleEvent: EventEmitter<boolean>  = new EventEmitter<boolean>(false);

  query = signal<string>('');
  filteredResults = signal<any[]>([]);
  loading = signal<boolean>(false);
  error = signal<string>("");

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
          this.error.set("");
          return this.searchService.searchAll(term);
        })
      )
      .subscribe({
        next: res => {

          const movieData = {
            label: 'MOVIE',
            value: 'movie',
            items: res.filter((item: any) => (item.media_type === "movie"))
          }
          const personData = {
            label: 'PERSON',
            value: 'person',
            items: res.filter((item: any) => (item.media_type === "person"))
          };
          const groupData = [];
          if(movieData.items.length) {
            groupData.push(movieData)
          }
          if(personData.items.length) {
            groupData.push(personData)
          }

         console.log(groupData);
          this.filteredResults.set(groupData)
        },
        error: err => {
          console.error(err);
          this.error.set('Failed to fetch search results.');
        },
        complete: () => this.loading.set(false),
      });
  }

  search(event: any) {
    this.searchInput$.next(event.query);
  }

  selectItem(item: any) {
    this.toggleEvent.emit(true);

    if (item.value.media_type === 'movie') {
      this.router.navigate(['/movie', item.value.id]);
    } else if (item.value.media_type === 'person') {
      this.router.navigate(['/person', item.value.id]);
    }

    this.query.set("");
  }

  retry() {
    this.searchInput$.next(this.query());
  }
}
