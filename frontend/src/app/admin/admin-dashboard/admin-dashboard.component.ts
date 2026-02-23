import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {

  constructor(private router: Router) {}

  ngOnInit(): void {}

  navigateToUsers(): void {
    this.router.navigate(['/admin/users']);
  }

  navigateToSubjects(): void {
    this.router.navigate(['/admin/subjects']);
  }

  navigateToGrades(): void {
    this.router.navigate(['/admin/grades']);
  }
}
