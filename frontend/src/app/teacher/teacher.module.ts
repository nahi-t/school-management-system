import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material.module';

import { TeacherRoutingModule } from './teacher-routing.module';
import { TeacherDashboardComponent } from './teacher-dashboard/teacher-dashboard.component';
import { MarkManagementComponent } from './mark-management/mark-management.component';
import { MarkDialogComponent } from './mark-management/mark-dialog/mark-dialog.component';

@NgModule({
  declarations: [
    TeacherDashboardComponent,
    MarkManagementComponent,
    MarkDialogComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule,
    TeacherRoutingModule
  ]
})
export class TeacherModule { }
