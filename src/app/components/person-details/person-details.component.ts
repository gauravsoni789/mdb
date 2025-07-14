import { Component, signal, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ChipModule } from 'primeng/chip';
import { LoadingStateComponent } from '../../shared/components/loading-state/loading-state.component';
import { ErrorStateComponent } from '../../shared/components/error-state/error-state.component';
import { NoDataComponent } from '../../shared/components/no-data/no-data.component';
import { PersonService } from './services/person.service';

import { CarouselModule } from 'primeng/carousel';
import { MovieService } from '../../shared/services/movie/movie.service';
import { Person, PersonCredit, PersonImage, PersonSocials } from './models/person.model';

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
  public error: WritableSignal<string> = signal<string>("");
  public gallery: WritableSignal<any[]> = signal([]);
  public knownFor: WritableSignal<any[]> = signal([]);
  public loading: WritableSignal<boolean> = signal(true);
  public person: WritableSignal<any | null> = signal(null);
  public showFullBio: WritableSignal<boolean> = signal(false);
  public socials: WritableSignal<any> = signal<any>({});

  constructor(
    private route: ActivatedRoute,
    private personService: PersonService,
    public movieService: MovieService
  ) {
    const id = this.route.snapshot.params['id'];
    this.loadPerson(id);
  }

  public toggleBio(): void {
    this.showFullBio.update(v => !v);
  }

  public retry(): void {
    const id = this.route.snapshot.params['id'];
    this.loadPerson(id);
  }

  private loadPerson(id: number): void {
  this.loading.set(true);
  this.error.set("");

  this.personService.getPersonDetails(id).subscribe({
    next: (res: Person) => {
      this.person.set(res);
      this.loading.set(false);
    },
    error: err => {
      console.error(err);
      this.error.set('Failed to load person details.');
      this.loading.set(false);
    }
  });

  this.personService.getPersonCredits(id).subscribe({
    next: (res: PersonCredit) => this.knownFor.set(res.cast.slice(0, 12)),
    error: () => this.error.set('Failed to load credits.')
  });

  this.personService.getPersonSocials(id).subscribe({
    next: (res: PersonSocials) => this.socials.set(res)
  });

  this.personService.getPersonImages(id).subscribe({
    next: (res: PersonImage) => this.gallery.set(res.profiles || [])
  });
}

}
