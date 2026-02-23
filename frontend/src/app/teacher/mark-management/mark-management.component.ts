import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MarkService, Mark } from '../../services/mark.service';
import { UserService } from '../../services/user.service';
import { SubjectService } from '../../services/subject.service';
import { GradeService } from '../../services/grade.service';
import { MarkDialogComponent } from './mark-dialog/mark-dialog.component';

@Component({
  selector: 'app-mark-management',
  templateUrl: './mark-management.component.html',
  styleUrls: ['./mark-management.component.scss']
})
export class MarkManagementComponent implements OnInit {
  marks: Mark[] = [];
  students: any[] = [];
  subjects: any[] = [];
  grades: any[] = [];
  displayedColumns: string[] = ['student', 'subject', 'grade', 'marks', 'term', 'actions'];
  isLoading = false;

  constructor(
    private markService: MarkService,
    private userService: UserService,
    private subjectService: SubjectService,
    private gradeService: GradeService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.isLoading = true;
    
    this.markService.getAllMarks().subscribe({
      next: (marks) => {
        this.marks = marks;
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        this.snackBar.open('Failed to load marks', 'Close', { duration: 3000 });
      }
    });

    this.userService.getStudents().subscribe({
      next: (students) => {
        console.log('Students loaded:', students);
        this.students = students;
      },
      error: (error) => {
        console.error('Failed to load students:', error);
        this.snackBar.open('Failed to load students', 'Close', { duration: 3000 });
      }
    });

    this.subjectService.getAllSubjects().subscribe({
      next: (subjects) => {
        console.log('Subjects loaded:', subjects);
        this.subjects = subjects;
      },
      error: (error) => {
        console.error('Failed to load subjects:', error);
        this.snackBar.open('Failed to load subjects', 'Close', { duration: 3000 });
      }
    });

    this.gradeService.getAllGrades().subscribe({
      next: (grades) => {
        console.log('Grades loaded:', grades);
        this.grades = grades;
      },
      error: (error) => {
        console.error('Failed to load grades:', error);
        this.snackBar.open('Failed to load grades', 'Close', { duration: 3000 });
      }
    });
  }

  openMarkDialog(mark?: Mark): void {
    const dialogRef = this.dialog.open(MarkDialogComponent, {
      width: '500px',
      data: { mark, students: this.students, subjects: this.subjects, grades: this.grades }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadData();
      }
    });
  }

  getMarkClass(marks: number): string {
    if (marks >= 85) return 'mark-excellent';
    if (marks >= 70) return 'mark-good';
    if (marks >= 50) return 'mark-average';
    return 'mark-poor';
  }

  deleteMark(mark: Mark): void {
    if (confirm(`Are you sure you want to delete this mark?`)) {
      this.markService.deleteMark(mark._id).subscribe({
        next: () => {
          this.snackBar.open('Mark deleted successfully', 'Close', { duration: 3000 });
          this.loadData();
        },
        error: (error) => {
          this.snackBar.open('Failed to delete mark', 'Close', { duration: 3000 });
        }
      });
    }
  }
}
