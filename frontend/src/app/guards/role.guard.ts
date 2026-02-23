import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(route: any): boolean {
    const expectedRoles = route.data.expectedRoles;
    const user = this.authService.currentUserValue;

    if (!user) {
      this.router.navigate(['/login']);
      return false;
    }

    if (expectedRoles && expectedRoles.includes(user.role)) {
      return true;
    } else {
      this.router.navigate(['/unauthorized']);
      return false;
    }
  }
}
