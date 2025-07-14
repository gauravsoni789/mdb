import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PersonDetailsComponent } from './person-details.component';
import { ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';
import { PersonService } from './services/person.service';
import { MovieService } from '../../shared/services/movie/movie.service';

fdescribe('PersonDetailsComponent', () => {
  let component: PersonDetailsComponent;
  let fixture: ComponentFixture<PersonDetailsComponent>;
  let personServiceSpy: jasmine.SpyObj<PersonService>;

  beforeEach(async () => {
    const routeStub = {
      snapshot: { params: { id: 1 } }
    };

    personServiceSpy = jasmine.createSpyObj('PersonService', [
      'getPersonDetails',
      'getPersonCredits',
      'getPersonSocials',
      'getPersonImages'
    ]);

    await TestBed.configureTestingModule({
      imports: [PersonDetailsComponent],
      providers: [
        { provide: ActivatedRoute, useValue: routeStub },
        { provide: PersonService, useValue: personServiceSpy },
        { provide: MovieService, useValue: {} }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonDetailsComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
