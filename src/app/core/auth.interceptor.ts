import { HttpInterceptorFn } from '@angular/common/http';
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('demo-user');
  return next(token ? req.clone({ setHeaders: { Authorization: `Bearer ${btoa(token)}` } }) : req);
};
