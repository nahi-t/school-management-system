import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

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
  private apiUrl = 'http://localhost:5000/api/users';

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
    return this.http.get<User[]>(this.apiUrl, { headers: this.getAuthHeaders() });
  }

  getUserById(id: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }

  createUser(user: Partial<User>): Observable<User> {
    return this.http.post<User>(this.apiUrl, user, { headers: this.getAuthHeaders() });
  }

  updateUser(id: string, user: Partial<User>): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${id}`, user, { headers: this.getAuthHeaders() });
  }

  deleteUser(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }

  getTeachers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/teachers`, { headers: this.getAuthHeaders() });
  }

  getStudents(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/students`, { headers: this.getAuthHeaders() });
  }
}
