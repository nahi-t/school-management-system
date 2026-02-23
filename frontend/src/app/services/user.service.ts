import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment, getApiUrl, getFallbackApiUrl } from '../../environments/environment.prod';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  token?: string;
  assignedSubjects?: any[];
  assignedGrades?: any[];
  enrolledGrade?: any;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = environment.production ? getApiUrl() : getFallbackApiUrl();
  private usersUrl = `${this.baseUrl}/users`;

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const storedUser = localStorage.getItem('currentUser');

    if (!storedUser) {
      return new HttpHeaders();
    }

    const parsedUser = JSON.parse(storedUser);

    if (!parsedUser?.token) {
      return new HttpHeaders();
    }

    return new HttpHeaders().set(
      'Authorization',
      `Bearer ${parsedUser.token}`
    );
  }

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.usersUrl, { headers: this.getAuthHeaders() });
  }

  getUserById(id: string): Observable<User> {
    return this.http.get<User>(`${this.usersUrl}/${id}`, { headers: this.getAuthHeaders() });
  }

  createUser(user: Partial<User>): Observable<User> {
    return this.http.post<User>(this.usersUrl, user, { headers: this.getAuthHeaders() });
  }

  updateUser(id: string, user: Partial<User>): Observable<User> {
    return this.http.put<User>(`${this.usersUrl}/${id}`, user, { headers: this.getAuthHeaders() });
  }

  deleteUser(id: string): Observable<void> {
    return this.http.delete<void>(`${this.usersUrl}/${id}`, { headers: this.getAuthHeaders() });
  }

  getTeachers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.usersUrl}/teachers`, { headers: this.getAuthHeaders() });
  }

  getStudents(): Observable<User[]> {
    return this.http.get<User[]>(`${this.usersUrl}/students`, { headers: this.getAuthHeaders() });
  }
}
