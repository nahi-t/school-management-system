import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AppInitService {
  constructor(private authService: AuthService) {}

  initializeApp(): void {
    console.log('AppInitService: Initializing application...');
    this.authService.initializeAuth();
  }
}
