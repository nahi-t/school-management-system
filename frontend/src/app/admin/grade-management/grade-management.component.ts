import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GradeService, Grade } from '../../services/grade.service';
import { UserService } from '../../services/user.service';
import { SubjectService } from '../../services/subject.service';
import { GradeDialogComponent } from './grade-dialog/grade-dialog.component';

@Component({
  selector: 'app-grade-management',
  templateUrl: './grade-management.component.html',
  styleUrls: ['./grade-management.component.scss']
})
export class GradeManagementComponent implements OnInit {
  grades: Grade[] = [];
  teachers: any[] = [];
  subjects: any[] = [];
  displayedColumns: string[] = ['name', 'description', 'assignedTeacher', 'studentsCount', 'actions'];
  isLoading = false;

  constructor(
    private gradeService: GradeService,
    private userService: UserService,
    private subjectService: SubjectService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.isLoading = true;
    
    this.gradeService.getAllGrades().subscribe({
      next: (grades) => {
        this.grades = grades;
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        this.snackBar.open('Failed to load grades', 'Close', { duration: 3000 });
      }
    });

    this.userService.getTeachers().subscribe({
      next: (teachers) => {
        this.teachers = teachers;
      },
      error: (error) => {
        this.snackBar.open('Failed to load teachers', 'Close', { duration: 3000 });
      }
    });

    this.subjectService.getAllSubjects().subscribe({
      next: (subjects) => {
        this.subjects = subjects;
      },
      error: (error) => {
        this.snackBar.open('Failed to load subjects', 'Close', { duration: 3000 });
      }
    });
  }

  openGradeDialog(grade?: Grade): void {
    const dialogRef = this.dialog.open(GradeDialogComponent, {
      width: '500px',
      data: { grade, teachers: this.teachers, subjects: this.subjects }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadData();
      }
    });
  }

  deleteGrade(grade: Grade): void {
    if (confirm(`Are you sure you want to delete ${grade.name}?`)) {
      this.gradeService.deleteGrade(grade._id).subscribe({
        next: () => {
          this.snackBar.open('Grade deleted successfully', 'Close', { duration: 3000 });
          this.loadData();
        },
        error: (error) => {
          this.snackBar.open('Failed to delete grade', 'Close', { duration: 3000 });
        }
      });
    }
  }

  getStudentsCount(grade: Grade): number {
    return grade.students?.length || 0;
  }
}
