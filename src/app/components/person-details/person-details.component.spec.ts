import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { PersonDetailsComponent } from './person-details.component';
import { ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';
import { PersonService } from './services/person.service';
import { MovieService } from '../../shared/services/movie/movie.service';

describe('PersonDetailsComponent', () => {
  let component: PersonDetailsComponent;
  let fixture: ComponentFixture<PersonDetailsComponent>;
  let personServiceSpy: jasmine.SpyObj<PersonService>;
  let movieServiceSpy: jasmine.SpyObj<MovieService>;

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

    personServiceSpy.getPersonDetails.and.returnValue(of());
    personServiceSpy.getPersonCredits.and.returnValue(of({ cast: [] }));
    personServiceSpy.getPersonSocials.and.returnValue(of({}));
    personServiceSpy.getPersonImages.and.returnValue(of({ profiles: [] }));

    movieServiceSpy = jasmine.createSpyObj('MovieService', [
      'getPosterUrl',
      'getBackdropUrl',
      'getProfileUrl'
    ]);

    movieServiceSpy.getPosterUrl.and.callFake((path: string) => `mockPosterUrl/${path}`);
    movieServiceSpy.getBackdropUrl.and.callFake((path: string | undefined) => path ? `mockBackdropUrl/${path}` : '');
    movieServiceSpy.getProfileUrl.and.callFake((path: string | undefined) => path ? `mockProfileUrl/${path}` : '');

    await TestBed.configureTestingModule({
      imports: [PersonDetailsComponent],
      providers: [
        { provide: ActivatedRoute, useValue: routeStub },
        { provide: PersonService, useValue: personServiceSpy },
        { provide: MovieService, useValue: movieServiceSpy }
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

  it('should toggle showFullBio signal', () => {
    expect(component.showFullBio()).toBe(false);

    component.toggleBio();
    expect(component.showFullBio()).toBe(true);

    component.toggleBio();
    expect(component.showFullBio()).toBe(false);
  });

  it('should call loadPerson when retry is called', () => {
    const spy = spyOn<any>(component, 'loadPerson');

    component.retry();

    expect(spy).toHaveBeenCalledWith(1);
  });


it('should load person details successfully', fakeAsync(() => {
  const mockPerson = {
    id: 1,
    name: 'John Doe',
    biography: 'A famous actor.',
    birthday: '1970-01-01',
    deathday: null,
    place_of_birth: 'Los Angeles, USA',
    gender: 2,
    known_for_department: 'Acting',
    popularity: 8.5,
    profile_path: '/profile.jpg',
    also_known_as: ['Johnny'],
    homepage: 'https://example.com'
  };

  const mockCredits = { cast: Array(15).fill({}) };
  const mockSocials = { twitter_id: '@mock' };
  const mockImages = {
    id: 1,
    profiles: [{ file_path: 'img.jpg', width: 500, height: 750 }]
  };

  personServiceSpy.getPersonDetails.and.returnValue(of(mockPerson));
  personServiceSpy.getPersonCredits.and.returnValue(of(mockCredits));
  personServiceSpy.getPersonSocials.and.returnValue(of(mockSocials));
  personServiceSpy.getPersonImages.and.returnValue(of(mockImages));

  fixture = TestBed.createComponent(PersonDetailsComponent);
  component = fixture.componentInstance;

  fixture.detectChanges();
  tick(); 

  expect(component.person()).toEqual(mockPerson);
  expect(component.knownFor().length).toBe(12); 
  expect(component.socials()).toEqual(mockSocials);
  expect(component.gallery()).toEqual(mockImages.profiles);
  expect(component.loading()).toBe(false);
}));

it('should set error if getPersonDetails fails', fakeAsync(() => {
  personServiceSpy.getPersonDetails.and.returnValue(throwError(() => new Error('API failure')));
  personServiceSpy.getPersonCredits.and.returnValue(of({ cast: [] }));
  personServiceSpy.getPersonSocials.and.returnValue(of({}));
  personServiceSpy.getPersonImages.and.returnValue(of({ profiles: [] }));

  fixture = TestBed.createComponent(PersonDetailsComponent);
  component = fixture.componentInstance;

  fixture.detectChanges();
  tick(); 

  expect(component.error()).toBe('Failed to load person details.');
  expect(component.loading()).toBe(false);

  expect(component.person()).toBeNull();
}));


it('should handle empty gallery', fakeAsync(() => {
  const mockPerson = {
    id: 1,
    name: 'Jane Doe',
    biography: '',
    birthday: '',
    deathday: null,
    place_of_birth: '',
    gender: 1,
    known_for_department: '',
    popularity: 0,
    profile_path: '',
    also_known_as: [],
    homepage: ''
  };

  personServiceSpy.getPersonDetails.and.returnValue(of(mockPerson));
  personServiceSpy.getPersonCredits.and.returnValue(of({ cast: [] }));
  personServiceSpy.getPersonSocials.and.returnValue(of({}));
  personServiceSpy.getPersonImages.and.returnValue(of({ profiles: [] }));

  fixture = TestBed.createComponent(PersonDetailsComponent);
  component = fixture.componentInstance;

  fixture.detectChanges();
  tick();

  expect(component.gallery().length).toBe(0);
}));

it('should limit knownFor movies to 12 items', fakeAsync(() => {
  const mockPerson = {
    id: 1,
    name: 'Actor',
    biography: '',
    birthday: '',
    deathday: null,
    place_of_birth: '',
    gender: 1,
    known_for_department: '',
    popularity: 0,
    profile_path: '',
    also_known_as: [],
    homepage: ''
  };

  const mockCredits = {
    cast: Array(25).fill({ id: 1, poster_path: 'poster.jpg', title: 'Movie', release_date: '2024-01-01' })
  };

  personServiceSpy.getPersonDetails.and.returnValue(of(mockPerson));
  personServiceSpy.getPersonCredits.and.returnValue(of(mockCredits));
  personServiceSpy.getPersonSocials.and.returnValue(of({}));
  personServiceSpy.getPersonImages.and.returnValue(of({ profiles: [] }));

  fixture = TestBed.createComponent(PersonDetailsComponent);
  component = fixture.componentInstance;

  fixture.detectChanges();
  tick();

  expect(component.knownFor().length).toBe(12);
}));

it('should toggle showFullBio back and forth', () => {
  expect(component.showFullBio()).toBe(false);
  component.toggleBio();
  expect(component.showFullBio()).toBe(true);
  component.toggleBio();
  expect(component.showFullBio()).toBe(false);
});


});
