import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GradeService, Grade } from '../../../services/grade.service';

export interface GradeDialogData {
  grade?: Grade;
  teachers: any[];
  subjects: any[];
}

@Component({
  selector: 'app-grade-dialog',
  templateUrl: './grade-dialog.component.html',
  styleUrls: ['./grade-dialog.component.scss']
})
export class GradeDialogComponent implements OnInit {
  gradeForm: FormGroup;
  isEdit = false;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<GradeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: GradeDialogData,
    private gradeService: GradeService,
    private snackBar: MatSnackBar
  ) {
    this.gradeForm = this.fb.group({
      name: ['', [Validators.required]],
      description: [''],
      assignedTeacher: ['']
    });
  }

  ngOnInit(): void {
    if (this.data.grade) {
      this.isEdit = true;
      this.gradeForm.patchValue({
        name: this.data.grade.name,
        description: this.data.grade.description,
        assignedTeacher: this.data.grade.assignedTeacher?._id || ''
      });
    }
  }

  onSubmit(): void {
    if (this.gradeForm.valid) {
      this.isLoading = true;
      const gradeData = this.gradeForm.value;

      if (this.isEdit) {
        this.gradeService.updateGrade(this.data.grade!._id, gradeData).subscribe({
          next: () => {
            this.snackBar.open('Grade updated successfully', 'Close', { duration: 3000 });
            this.dialogRef.close(true);
          },
          error: (error) => {
            this.isLoading = false;
            this.snackBar.open('Failed to update grade', 'Close', { duration: 3000 });
          }
        });
      } else {
        this.gradeService.createGrade(gradeData).subscribe({
          next: () => {
            this.snackBar.open('Grade created successfully', 'Close', { duration: 3000 });
            this.dialogRef.close(true);
          },
          error: (error) => {
            this.isLoading = false;
            this.snackBar.open('Failed to create grade', 'Close', { duration: 3000 });
          }
        });
      }
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
