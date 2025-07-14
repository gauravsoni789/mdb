import { HttpInterceptorFn } from '@angular/common/http';
import { API_BASE_URL, API_KEY } from '../constants/api.constants';

export const apiKeyInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.url.includes(API_BASE_URL)) {
    const cloned = req.clone({
      params: req.params.set('api_key', API_KEY)
    });
    return next(cloned);
  }

  return next(req);
};
