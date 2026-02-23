import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

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
  private apiUrl = environment.production ? 'https://school-management-system-swti.onrender.com/api/auth' : 'http://localhost:5000/api/auth';
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    const storedUser = localStorage.getItem('currentUser');
    try {
      this.currentUserSubject = new BehaviorSubject<User | null>(
        storedUser ? JSON.parse(storedUser) : null
      );
    } catch (error) {
      console.error('Error parsing stored user:', error);
      localStorage.removeItem('currentUser');
      this.currentUserSubject = new BehaviorSubject<User | null>(null);
    }
    this.currentUser = this.currentUserSubject.asObservable();
  }

  initializeAuth(): void {
    console.log('AuthService: Initializing authentication...');
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        this.currentUserSubject.next(user);
        console.log('AuthService: User restored from localStorage:', user);
      } catch (error) {
        console.error('AuthService: Error restoring user:', error);
        localStorage.removeItem('currentUser');
        this.currentUserSubject.next(null);
      }
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
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
        return user;
      }));
  }

  register(name: string, email: string, password: string, role: string): Observable<User> {
    return this.http.post<any>(`${this.apiUrl}/register`, { name, email, password, role })
      .pipe(map(response => {
        const user = response.user;
        user.token = response.token;
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
        return user;
      }));
  }

  logout(): void {
    localStorage.removeItem('currentUser');
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
