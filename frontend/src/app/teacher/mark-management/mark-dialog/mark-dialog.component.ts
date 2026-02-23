import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MarkService, Mark } from '../../../services/mark.service';

export interface MarkDialogData {
  mark?: Mark;
  students: any[];
  subjects: any[];
  grades: any[];
}

@Component({
  selector: 'app-mark-dialog',
  templateUrl: './mark-dialog.component.html',
  styleUrls: ['./mark-dialog.component.scss']
})
export class MarkDialogComponent implements OnInit {
  markForm: FormGroup;
  isEdit = false;
  isLoading = false;
  terms = ['Term 1', 'Term 2', 'Term 3', 'Final'];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<MarkDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: MarkDialogData,
    private markService: MarkService,
    private snackBar: MatSnackBar
  ) {
    this.markForm = this.fb.group({
      student: ['', [Validators.required]],
      subject: ['', [Validators.required]],
      grade: ['', [Validators.required]],
      marks: ['', [Validators.required, Validators.min(0), Validators.max(100)]],
      term: ['Term 1', [Validators.required]]
    });
  }

  ngOnInit(): void {
    console.log('MarkDialog Data:', this.data);
    console.log('Students:', this.data.students);
    console.log('Subjects:', this.data.subjects);
    console.log('Grades:', this.data.grades);
    
    if (this.data.mark) {
      this.isEdit = true;
      this.markForm.patchValue({
        student: this.data.mark.student._id,
        subject: this.data.mark.subject._id,
        grade: this.data.mark.grade._id,
        marks: this.data.mark.marks,
        term: this.data.mark.term
      });
    }
  }

  onSubmit(): void {
    if (this.markForm.valid) {
      this.isLoading = true;
      const markData = this.markForm.value;

      if (this.isEdit) {
        this.markService.updateMark(this.data.mark!._id, markData).subscribe({
          next: () => {
            this.snackBar.open('Mark updated successfully', 'Close', { duration: 3000 });
            this.dialogRef.close(true);
          },
          error: (error) => {
            this.isLoading = false;
            this.snackBar.open('Failed to update mark', 'Close', { duration: 3000 });
          }
        });
      } else {
        this.markService.createMark(markData).subscribe({
          next: () => {
            this.snackBar.open('Mark created successfully', 'Close', { duration: 3000 });
            this.dialogRef.close(true);
          },
          error: (error) => {
            this.isLoading = false;
            this.snackBar.open('Failed to create mark', 'Close', { duration: 3000 });
          }
        });
      }
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
