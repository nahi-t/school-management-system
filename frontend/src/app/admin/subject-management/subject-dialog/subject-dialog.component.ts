import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SubjectService, Subject } from '../../../services/subject.service';

export interface SubjectDialogData {
  subject?: Subject;
  teachers: any[];
}

@Component({
  selector: 'app-subject-dialog',
  templateUrl: './subject-dialog.component.html',
  styleUrls: ['./subject-dialog.component.scss']
})
export class SubjectDialogComponent implements OnInit {
  subjectForm: FormGroup;
  isEdit = false;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<SubjectDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: SubjectDialogData,
    private subjectService: SubjectService,
    private snackBar: MatSnackBar
  ) {
    this.subjectForm = this.fb.group({
      name: ['', [Validators.required]],
      description: [''],
      assignedTeacher: ['']
    });
  }

  ngOnInit(): void {
    if (this.data.subject) {
      this.isEdit = true;
      this.subjectForm.patchValue({
        name: this.data.subject.name,
        description: this.data.subject.description,
        assignedTeacher: this.data.subject.assignedTeacher?.id || ''
      });
    }
  }

  onSubmit(): void {
    if (this.subjectForm.valid) {
      this.isLoading = true;
      const subjectData = this.subjectForm.value;

      if (this.isEdit) {
        this.subjectService.updateSubject(this.data.subject!._id, subjectData).subscribe({
          next: () => {
            this.snackBar.open('Subject updated successfully', 'Close', { duration: 3000 });
            this.dialogRef.close(true);
          },
          error: (error) => {
            this.isLoading = false;
            this.snackBar.open('Failed to update subject', 'Close', { duration: 3000 });
          }
        });
      } else {
        this.subjectService.createSubject(subjectData).subscribe({
          next: () => {
            this.snackBar.open('Subject created successfully', 'Close', { duration: 3000 });
            this.dialogRef.close(true);
          },
          error: (error) => {
            this.isLoading = false;
            this.snackBar.open('Failed to create subject', 'Close', { duration: 3000 });
          }
        });
      }
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
