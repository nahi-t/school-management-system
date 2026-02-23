import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { UserManagementComponent } from './user-management/user-management.component';
import { SubjectManagementComponent } from './subject-management/subject-management.component';
import { GradeManagementComponent } from './grade-management/grade-management.component';

const routes: Routes = [
  {
    path: '',
    component: AdminDashboardComponent
  },
  {
    path: 'users',
    component: UserManagementComponent
  },
  {
    path: 'subjects',
    component: SubjectManagementComponent
  },
  {
    path: 'grades',
    component: GradeManagementComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
