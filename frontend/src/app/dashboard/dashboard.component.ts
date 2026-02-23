import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  currentUser: any;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.currentUser = this.authService.currentUserValue;
  }

  getWelcomeMessage(): string {
    if (!this.currentUser) return 'Welcome!';
    
    const roleMessages = {
      admin: 'Administrator',
      teacher: 'Teacher',
      student: 'Student'
    };
    
    return `Welcome, ${this.currentUser.name}! (${roleMessages[this.currentUser.role as keyof typeof roleMessages]})`;
  }

  getRoleFeatures(): string[] {
    if (!this.currentUser) return [];
    
    const features = {
      admin: [
        'Manage all users (teachers, students)',
        'Create and manage subjects',
        'Create and manage grades',
        'Assign teachers to subjects and grades',
        'View all marks and reports'
      ],
      teacher: [
        'View assigned students',
        'Assign marks to students',
        'View student grades',
        'Manage subject-specific data'
      ],
      student: [
        'View my grades',
        'View my marks for enrolled subjects',
        'Track academic progress'
      ]
    };
    
    return features[this.currentUser.role as keyof typeof features] || [];
  }
}
