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
  private baseUrl = environment.production ? getApiUrl() : getFallbackApiUrl();
  private marksUrl = `${this.baseUrl}/marks`;

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
    return this.http.get<Mark[]>(this.marksUrl, { headers: this.getAuthHeaders() });
  }

  getMarksByStudent(studentId: string): Observable<Mark[]> {
    return this.http.get<Mark[]>(`${this.marksUrl}/student/${studentId}`, { headers: this.getAuthHeaders() });
  }

  getMarksBySubject(subjectId: string): Observable<Mark[]> {
    return this.http.get<Mark[]>(`${this.marksUrl}/subject/${subjectId}`, { headers: this.getAuthHeaders() });
  }

  createMark(mark: Partial<Mark>): Observable<Mark> {
    return this.http.post<Mark>(this.marksUrl, mark, { headers: this.getAuthHeaders() });
  }

  updateMark(id: string, mark: Partial<Mark>): Observable<Mark> {
    return this.http.put<Mark>(`${this.marksUrl}/${id}`, mark, { headers: this.getAuthHeaders() });
  }

  deleteMark(id: string): Observable<void> {
    return this.http.delete<void>(`${this.marksUrl}/${id}`, { headers: this.getAuthHeaders() });
  }
}
