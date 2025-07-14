import { HttpRequest, HttpHandlerFn, HttpEvent, HttpParams } from '@angular/common/http';
import { apiKeyInterceptor } from './api-key.interceptor';
import { API_BASE_URL, API_KEY } from '../constants/api.constants';
import { of } from 'rxjs';

describe('apiKeyInterceptor', () => {
  it('should add api_key param for TMDB requests', (done) => {
    const req = new HttpRequest('GET', API_BASE_URL+'/movie/popular', {
      params: new HttpParams()
    });

    const next: HttpHandlerFn = (clonedReq) => {
      expect(clonedReq.params.has('api_key')).toBeTrue();
      expect(clonedReq.params.get('api_key')).toBe(API_KEY);
      done();
      return of({} as HttpEvent<any>);
    };

    apiKeyInterceptor(req, next).subscribe();
  });

  it('should NOT modify requests to other domains', (done) => {
    const req = new HttpRequest('GET', 'https://example.com/api');

    const next: HttpHandlerFn = (sameReq) => {
      expect(sameReq).toBe(req);
      done();
      return of({} as HttpEvent<any>);
    };

    apiKeyInterceptor(req, next).subscribe();
  });
});
