import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router, CanActivateFn } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
class AuthenticationGuardService {

  constructor(private router: Router) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | UrlTree {

    const authToken = localStorage.getItem("jwt-auth-token");

    if (authToken) {
      return true;
    } else {
      return this.router.parseUrl('/signup');
    }
  }
}

export const AuthGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree => {
  return inject(AuthenticationGuardService).canActivate(route, state);
}
