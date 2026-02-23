import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment, getApiUrl } from '../../environments/environment.prod';
import { StorageService } from './storage.service';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  token?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.production ? getApiUrl() : 'http://localhost:5000/api/auth';
  private currentUserSubject: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null);
  public currentUser: Observable<User | null>;

  constructor(
    private http: HttpClient,
    private router: Router,
    private storageService: StorageService
  ) {
    this.currentUser = this.currentUserSubject.asObservable();
    this.initializeAuth();
  }

  initializeAuth(): void {
    console.log('AuthService: Initializing authentication...');
    const storedUser = this.storageService.getUser();
    if (storedUser) {
      this.currentUserSubject.next(storedUser);
      console.log('AuthService: User restored from storage:', storedUser);
    } else {
      console.log('AuthService: No stored user found');
    }
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  login(email: string, password: string): Observable<User> {
    return this.http.post<any>(`${this.apiUrl}/login`, { email, password })
      .pipe(map(response => {
        const user = response.user;
        user.token = response.token;
        
        // Store user with timestamp for debugging
        const userWithTimestamp = {
          ...user,
          loginTime: new Date().toISOString()
        };
        
        this.storageService.setUser(userWithTimestamp);
        this.currentUserSubject.next(userWithTimestamp);
        
        console.log('AuthService: User logged in:', userWithTimestamp);
        return userWithTimestamp;
      }));
  }

  register(name: string, email: string, password: string, role: string): Observable<User> {
    return this.http.post<any>(`${this.apiUrl}/register`, { name, email, password, role })
      .pipe(map(response => {
        const user = response.user;
        user.token = response.token;
        this.storageService.setUser(user);
        this.currentUserSubject.next(user);
        return user;
      }));
  }

  logout(): void {
    this.storageService.removeUser();
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    const currentUser = this.currentUserSubject.value;
    if (!currentUser) return false;
    
    // Check if token exists and is not expired
    const token = currentUser.token;
    if (!token) return false;
    
    try {
      // Basic token validation (you can enhance this with JWT decoding)
      const payload = JSON.parse(atob(token.split('.')[1]));
      const now = Date.now() / 1000;
      return payload.exp > now;
    } catch (error) {
      console.error('Token validation error:', error);
      return false;
    }
  }

  hasRole(role: string): boolean {
    return this.currentUserValue?.role === role;
  }

  hasAnyRole(roles: string[]): boolean {
    return roles.includes(this.currentUserValue?.role || '');
  }

  getToken(): string | null {
    return this.currentUserValue?.token || null;
  }
}
