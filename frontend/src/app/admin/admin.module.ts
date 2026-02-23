import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material.module';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { UserManagementComponent } from './user-management/user-management.component';
import { UserDialogComponent } from './user-management/user-dialog/user-dialog.component';
import { SubjectManagementComponent } from './subject-management/subject-management.component';
import { SubjectDialogComponent } from './subject-management/subject-dialog/subject-dialog.component';
import { GradeManagementComponent } from './grade-management/grade-management.component';
import { GradeDialogComponent } from './grade-management/grade-dialog/grade-dialog.component';

@NgModule({
  declarations: [
    AdminDashboardComponent,
    UserManagementComponent,
    UserDialogComponent,
    SubjectManagementComponent,
    SubjectDialogComponent,
    GradeManagementComponent,
    GradeDialogComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule,
    AdminRoutingModule
  ]
})
export class AdminModule { }
