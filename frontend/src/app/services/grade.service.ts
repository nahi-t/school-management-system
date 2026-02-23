import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment, getApiUrl, getFallbackApiUrl } from '../../environments/environment.prod';

export interface Grade {
  _id: string;
  name: string;
  description?: string;
  assignedTeacher?: any;
  students?: any[];
  subjects?: any[];
}

@Injectable({
  providedIn: 'root'
})
export class GradeService {
  private apiUrl = environment.production ? getApiUrl().replace('/api/auth', '/api/grades') : getFallbackApiUrl().replace('/api/auth', '/api/grades');

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

  getAllGrades(): Observable<Grade[]> {
    return this.http.get<Grade[]>(this.apiUrl, { headers: this.getAuthHeaders() });
  }

  getGradeById(id: string): Observable<Grade> {
    return this.http.get<Grade>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }

  createGrade(grade: Partial<Grade>): Observable<Grade> {
    return this.http.post<Grade>(this.apiUrl, grade, { headers: this.getAuthHeaders() });
  }

  updateGrade(id: string, grade: Partial<Grade>): Observable<Grade> {
    return this.http.put<Grade>(`${this.apiUrl}/${id}`, grade, { headers: this.getAuthHeaders() });
  }

  deleteGrade(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }

  assignTeacher(gradeId: string, teacherId: string): Observable<Grade> {
    return this.http.post<Grade>(`${this.apiUrl}/${gradeId}/assign-teacher`, 
      { teacherId }, { headers: this.getAuthHeaders() });
  }

  addStudent(gradeId: string, studentId: string): Observable<Grade> {
    return this.http.post<Grade>(`${this.apiUrl}/${gradeId}/add-student`, 
      { studentId }, { headers: this.getAuthHeaders() });
  }

  addSubject(gradeId: string, subjectId: string): Observable<Grade> {
    return this.http.post<Grade>(`${this.apiUrl}/${gradeId}/add-subject`, 
      { subjectId }, { headers: this.getAuthHeaders() });
  }
}
