import { HttpInterceptorFn } from '@angular/common/http';
import { API_KEY } from '../constants/api.constants';

export const apiKeyInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.url.includes('api.themoviedb.org/3')) {
    const cloned = req.clone({
      params: req.params.set('api_key', API_KEY)
    });
    return next(cloned);
  }

  return next(req);
};
