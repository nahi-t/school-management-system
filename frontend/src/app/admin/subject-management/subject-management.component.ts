import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SubjectService, Subject } from '../../services/subject.service';
import { UserService } from '../../services/user.service';
import { SubjectDialogComponent } from './subject-dialog/subject-dialog.component';

@Component({
  selector: 'app-subject-management',
  templateUrl: './subject-management.component.html',
  styleUrls: ['./subject-management.component.scss']
})
export class SubjectManagementComponent implements OnInit {
  subjects: Subject[] = [];
  teachers: any[] = [];
  displayedColumns: string[] = ['name', 'description', 'assignedTeacher', 'actions'];
  isLoading = false;

  constructor(
    private subjectService: SubjectService,
    private userService: UserService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.isLoading = true;
    
    this.subjectService.getAllSubjects().subscribe({
      next: (subjects) => {
        this.subjects = subjects;
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        this.snackBar.open('Failed to load subjects', 'Close', { duration: 3000 });
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
  }

  openSubjectDialog(subject?: Subject): void {
    const dialogRef = this.dialog.open(SubjectDialogComponent, {
      width: '500px',
      data: { subject, teachers: this.teachers }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadData();
      }
    });
  }

  deleteSubject(subject: Subject): void {
    if (confirm(`Are you sure you want to delete ${subject.name}?`)) {
      this.subjectService.deleteSubject(subject._id).subscribe({
        next: () => {
          this.snackBar.open('Subject deleted successfully', 'Close', { duration: 3000 });
          this.loadData();
        },
        error: (error) => {
          this.snackBar.open('Failed to delete subject', 'Close', { duration: 3000 });
        }
      });
    }
  }
}
