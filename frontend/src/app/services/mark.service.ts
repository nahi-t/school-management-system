import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment, getApiUrl, getFallbackApiUrl } from '../../environments/environment.prod';

export interface Mark {
  _id: string;              // ✅ FIXED (was id)
  student: any;
  subject: any;
  grade: any;
  marks: number;
  term: string;
  assignedBy: any;
  createdAt?: string;
  updatedAt?: string;
}

@Injectable({
  providedIn: 'root'
})
export class MarkService {
  private apiUrl = environment.production ? getApiUrl().replace('/api/auth', '/api/marks') : getFallbackApiUrl().replace('/api/auth', '/api/marks');

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

  getAllMarks(): Observable<Mark[]> {
    return this.http.get<Mark[]>(this.apiUrl, { headers: this.getAuthHeaders() });
  }

  getMarksByStudent(studentId: string): Observable<Mark[]> {
    return this.http.get<Mark[]>(`${this.apiUrl}/student/${studentId}`, { headers: this.getAuthHeaders() });
  }

  getMarksBySubject(subjectId: string): Observable<Mark[]> {
    return this.http.get<Mark[]>(`${this.apiUrl}/subject/${subjectId}`, { headers: this.getAuthHeaders() });
  }

  createMark(mark: Partial<Mark>): Observable<Mark> {
    return this.http.post<Mark>(this.apiUrl, mark, { headers: this.getAuthHeaders() });
  }

  updateMark(id: string, mark: Partial<Mark>): Observable<Mark> {
    return this.http.put<Mark>(`${this.apiUrl}/${id}`, mark, { headers: this.getAuthHeaders() });
  }

  deleteMark(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }
}
