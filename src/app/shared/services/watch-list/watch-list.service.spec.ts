import { TestBed } from '@angular/core/testing';
import { WatchlistService } from './watch-list.service';


describe('WatchListService', () => {
  let service: WatchlistService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WatchlistService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
