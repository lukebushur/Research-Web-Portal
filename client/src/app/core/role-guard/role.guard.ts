import { CanActivateFn } from '@angular/router';
import { Router } from '@angular/router';
import { inject } from '@angular/core';
import { map } from 'rxjs';
import { UserProfileService } from '../user-profile-service/user-profile.service';

export const roleGuard: CanActivateFn = (route, state) => {
  const userProfileService = inject(UserProfileService);
  const router = inject(Router);

  return userProfileService.getAccountInfo().pipe(
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
        return router.parseUrl('/unauthorized');
      }
    })
  );
};
