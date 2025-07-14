import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { SearchComponent } from './search.component';
import { Router } from '@angular/router';
import { SearchService } from './services/search.service';
import { of, throwError } from 'rxjs';

describe('SearchComponent', () => {
  let component: SearchComponent;
  let fixture: ComponentFixture<SearchComponent>;
  let mockSearchService: jasmine.SpyObj<SearchService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    mockSearchService = jasmine.createSpyObj('SearchService', ['searchAll']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [SearchComponent],
      providers: [
        { provide: SearchService, useValue: mockSearchService },
        { provide: Router, useValue: mockRouter },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit search results grouped by media_type', fakeAsync(() => {
    const mockResults = [
      { id: 1, name: 'Actor Name', media_type: 'person' },
      { id: 2, title: 'Movie Title', media_type: 'movie' },
    ];

    mockSearchService.searchAll.and.returnValue(of(mockResults));

    component.search({ query: 'test' });
    tick(300);

    expect(mockSearchService.searchAll).toHaveBeenCalledWith('test');

    tick(); 

    const grouped = component.filteredResults();
    expect(grouped.length).toBe(2);
    expect(grouped[0].label).toBe('MOVIE');
    expect(grouped[1].label).toBe('PERSON');
  }));

  it('should clear results for empty query', fakeAsync(() => {
    component.search({ query: '' });
    tick(300);
    expect(component.filteredResults()).toEqual([]);
    expect(mockSearchService.searchAll).not.toHaveBeenCalled();
  }));

  it('should handle errors and set error signal', fakeAsync(() => {
    mockSearchService.searchAll.and.returnValue(throwError(() => new Error('API Error')));
    component.search({ query: 'fail' });
    tick(300);
    tick();
    expect(component.error()).toBe('Failed to fetch search results.');
  }));

  it('should emit toggleEvent and navigate to movie', () => {
    const spy = spyOn(component['toggleEvent'], 'emit');
    const item = { value: { id: 10, media_type: 'movie', name: "jackie" } };
    component.selectItem(item);
    expect(spy).toHaveBeenCalledWith(true);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/movie', 10]);
  });

  it('should emit toggleEvent and navigate to person', () => {
    const spy = spyOn(component['toggleEvent'], 'emit');
    const item = { value: { id: 20, media_type: 'person', name: 'Some Person' } };
    component.selectItem(item);
    expect(spy).toHaveBeenCalledWith(true);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/person', 20]);
  });


  it('should retry search with last query', fakeAsync(() => {
    mockSearchService.searchAll.and.returnValue(of([]));
    component.query.set('test retry');

    component.retry();
    tick(300);
    expect(mockSearchService.searchAll).toHaveBeenCalledWith('test retry');
  }));

});
