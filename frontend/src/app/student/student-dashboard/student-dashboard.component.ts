import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { MarkService } from '../../services/mark.service';

@Component({
  selector: 'app-student-dashboard',
  templateUrl: './student-dashboard.component.html',
  styleUrls: ['./student-dashboard.component.scss']
})
export class StudentDashboardComponent implements OnInit {
  currentUser: any;
  marks: any[] = [];
  isLoading = false;

  constructor(
    private authService: AuthService,
    private markService: MarkService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.currentUserValue;
    this.loadMyMarks();
  }

  loadMyMarks(): void {
    this.isLoading = true;
    this.markService.getAllMarks().subscribe({
      next: (marks) => {
        this.marks = marks;
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Failed to load marks:', error);
      }
    });
  }

  getAverageMarks(): number {
    if (this.marks.length === 0) return 0;
    const total = this.marks.reduce((sum, mark) => sum + mark.marks, 0);
    return Math.round(total / this.marks.length);
  }

  getGradeClass(marks: number): string {
    if (marks >= 85) return 'grade-excellent';
    if (marks >= 70) return 'grade-good';
    if (marks >= 50) return 'grade-average';
    return 'grade-poor';
  }
}
