import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { SubjectService } from '../services/subject.service';
import { GradeService } from '../services/grade.service';
import { MarkService } from '../services/mark.service';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    HttpClientModule
  ],
  providers: [
    AuthService,
    UserService,
    SubjectService,
    GradeService,
    MarkService
  ]
})
export class CoreModule { }
