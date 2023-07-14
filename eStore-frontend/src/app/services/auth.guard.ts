import {
  CanActivateFn,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';

export const authGuard: CanActivateFn = (
  next: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  if (localStorage.getItem('token')) {
    return true;
  } else {
    const router = new Router();
    router.navigate(['login']);
    return false;
  }
};
