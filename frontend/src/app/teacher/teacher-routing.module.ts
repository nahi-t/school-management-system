import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TeacherDashboardComponent } from './teacher-dashboard/teacher-dashboard.component';
import { MarkManagementComponent } from './mark-management/mark-management.component';

const routes: Routes = [
  {
    path: '',
    component: TeacherDashboardComponent
  },
  {
    path: 'marks',
    component: MarkManagementComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TeacherRoutingModule { }
