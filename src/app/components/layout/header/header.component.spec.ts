import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideAnimations } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { HeaderComponent } from './header.component';

describe('HeaderComponent', () => {
  let fixture: ComponentFixture<HeaderComponent>;
  let component: HeaderComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HeaderComponent,       
        HttpClientTestingModule 
      ],
      providers: [
        provideAnimations(),
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({}),
            queryParams: of({}),
            snapshot: { paramMap: { get: () => null } }
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should contain the search popover', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const popover = compiled.querySelector('p-popover');
    expect(popover).toBeTruthy();
  });

  it('should open the search popover when search icon is clicked', () => {
    const compiled = fixture.nativeElement as HTMLElement;

    const searchButton = compiled.querySelector('a[alt="Search Movie or Person"]') as HTMLElement;
    expect(searchButton).toBeTruthy();

    searchButton.click();
    fixture.detectChanges();

    const searchComponent = document.querySelector('app-search');
    expect(searchComponent).toBeTruthy();
  });
});
