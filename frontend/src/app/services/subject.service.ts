import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment, getApiUrl, getFallbackApiUrl } from '../../environments/environment.prod';

/* ============================================
   SUBJECT INTERFACE (MongoDB uses _id)
============================================ */
export interface Subject {
  _id: string;              // ✅ FIXED (was id)
  name: string;
  description?: string;
  assignedTeacher?: any;
  grades?: any[];
}

@Injectable({
  providedIn: 'root'
})
export class SubjectService {

  private apiUrl = environment.production ? getApiUrl() : getFallbackApiUrl();
  private subjectsUrl = `${this.apiUrl}/subjects`;

  constructor(private http: HttpClient) {}

  /* ============================================
     AUTH HEADER HELPER (Safe Token Handling)
  ============================================ */
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

  /* ============================================
     GET ALL SUBJECTS
  ============================================ */
  getAllSubjects(): Observable<Subject[]> {
    return this.http.get<Subject[]>(
      this.apiUrl,
      { headers: this.getAuthHeaders() }
    );
  }

  /* ============================================
     GET SUBJECT BY ID
  ============================================ */
  getSubjectById(id: string): Observable<Subject> {
    if (!id) {
      throw new Error('Subject ID is required');
    }

    return this.http.get<Subject>(
      `${this.apiUrl}/${id}`,
      { headers: this.getAuthHeaders() }
    );
  }

  /* ============================================
     CREATE SUBJECT
  ============================================ */
  createSubject(subject: Partial<Subject>): Observable<Subject> {
    return this.http.post<Subject>(
      this.apiUrl,
      subject,
      { headers: this.getAuthHeaders() }
    );
  }

  /* ============================================
     UPDATE SUBJECT
  ============================================ */
  updateSubject(id: string, subject: Partial<Subject>): Observable<Subject> {
    if (!id) {
      throw new Error('Subject ID is required for update');
    }

    return this.http.put<Subject>(
      `${this.apiUrl}/${id}`,
      subject,
      { headers: this.getAuthHeaders() }
    );
  }

  /* ============================================
     DELETE SUBJECT
  ============================================ */
  deleteSubject(id: string): Observable<void> {
    if (!id) {
      throw new Error('Subject ID is required for delete');
    }

    return this.http.delete<void>(
      `${this.apiUrl}/${id}`,
      { headers: this.getAuthHeaders() }
    );
  }

  /* ============================================
     ASSIGN TEACHER TO SUBJECT
  ============================================ */
  assignTeacher(subjectId: string, teacherId: string): Observable<Subject> {
    if (!subjectId || !teacherId) {
      throw new Error('Subject ID and Teacher ID are required');
    }

    return this.http.post<Subject>(
      `${this.apiUrl}/${subjectId}/assign-teacher`,
      { teacherId },
      { headers: this.getAuthHeaders() }
    );
  }
}