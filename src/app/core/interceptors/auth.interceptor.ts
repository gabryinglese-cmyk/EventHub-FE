import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  const authRequest = req.clone({
    withCredentials: true
  });

  return next(authRequest);
};