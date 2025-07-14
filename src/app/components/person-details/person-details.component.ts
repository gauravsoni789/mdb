import { Component, signal, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ChipModule } from 'primeng/chip';
import { LoadingStateComponent } from '../../shared/components/loading-state/loading-state.component';
import { ErrorStateComponent } from '../../shared/components/error-state/error-state.component';
import { NoDataComponent } from '../../shared/components/no-data/no-data.component';
import { PersonService } from './services/person.service';
import { MovieService } from '../../shared/models/services/movie.service';

import { CarouselModule } from 'primeng/carousel';

@Component({
  selector: 'app-person-details',
  standalone: true,
  imports: [
    RouterLink,
    CommonModule,
    ChipModule,
    CarouselModule,
    LoadingStateComponent,
    ErrorStateComponent,
    NoDataComponent
  ],
  templateUrl: './person-details.component.html',
})
export class PersonDetailsComponent {
  person: WritableSignal<any | null> = signal(null);
  knownFor: WritableSignal<any[]> = signal([]);
  gallery: WritableSignal<any[]> = signal([]);
  loading: WritableSignal<boolean> = signal(true);
  socials: WritableSignal<any> = signal<any>({});
  showFullBio: WritableSignal<boolean> = signal(false);
  error: WritableSignal<string> = signal<string>("");

  responsiveOptions = [
    { breakpoint: '1024px', numVisible: 5 },
    { breakpoint: '768px', numVisible: 3 },
    { breakpoint: '560px', numVisible: 1 }
  ];

  constructor(
    private route: ActivatedRoute,
    private personService: PersonService,
    public movieService: MovieService
  ) {
    const id = this.route.snapshot.params['id'];
    this.loadPerson(id);
  }

  loadPerson(id: number) {
    this.loading.set(true);
    this.error.set("");

    this.personService.getPersonDetails(id).subscribe({
      next: res => this.person.set(res),
      error: err => {
        console.error(err);
        this.error.set('Failed to load person details.');
      },
      complete: () => this.loading.set(false)
    });

    this.personService.getPersonCredits(id).subscribe({
      next: res => this.knownFor.set(res.cast.slice(0, 12)),
      error: () => this.error.set('Failed to load credits.')
    });
  
    this.personService.getPersonSocials(id).subscribe({
      next: res => this.socials.set(res)
    });

    this.personService.getPersonImages(id).subscribe({
      next: res => this.gallery.set(res.profiles || [])
    });
  }

  toggleBio() {
    this.showFullBio.update(v => !v);
  }

  retry() {
    const id = this.route.snapshot.params['id'];
    this.loadPerson(id);
  }
}
