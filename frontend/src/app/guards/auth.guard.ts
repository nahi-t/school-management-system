import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(): boolean {
    const currentUser = this.authService.currentUserValue;
    console.log('AuthGuard: Current user:', currentUser);
    
    if (currentUser && this.authService.isLoggedIn()) {
      console.log('AuthGuard: User is logged in, allowing access');
      return true;
    } else {
      console.log('AuthGuard: User not logged in, redirecting to login');
      this.router.navigate(['/login']);
      return false;
    }
  }
}
