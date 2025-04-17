import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';

export const authGuard: CanActivateFn = async (route, state) => {
  const router = inject(Router);

  const authToken = localStorage.getItem("jwt-auth-token");

  if (authToken) {
    return true;
  } else {
    // TODO: snackbar notifying user of not being logged-in
    const result = router.parseUrl('/login');
    return result;
  }
};
