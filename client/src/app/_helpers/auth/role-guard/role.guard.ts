import { CanActivateFn } from '@angular/router';
import { Router } from '@angular/router';
import { AuthService } from 'app/controllers/auth-controller/auth.service';
import { inject } from '@angular/core';
import { map } from 'rxjs';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.getAccountInfo().pipe(
    map(accountInfo => {
      const userType = accountInfo.success.accountData.userType;
      if (userType === 1 && route.data['expectedRole'] === 'faculty') {
        //faculty
        return true;
      } else if (userType === 0 && route.data['expectedRole'] === 'student') {
        //student
        return true;
      } else if (userType === 2 && route.data['expectedRole'] === 'industry') {
        //industry
        return true;
      } else {
        //route to 404 page for now
        router.navigate(['/unauthorized']);
        return false;
      }
    })
  );
};
