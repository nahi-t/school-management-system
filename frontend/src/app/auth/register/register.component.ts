import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  hidePassword = true;
  isLoading = false;
  roles = ['admin', 'teacher', 'student'];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['student', [Validators.required]]
    });
  }

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.redirectBasedOnRole();
    }
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.isLoading = true;
      const { name, email, password, role } = this.registerForm.value;

      this.authService.register(name, email, password, role).subscribe({
        next: () => {
          this.snackBar.open('Registration successful!', 'Close', { duration: 3000 });
          this.redirectBasedOnRole();
        },
        error: (error) => {
          this.isLoading = false;
          this.snackBar.open(error.error?.message || 'Registration failed', 'Close', { duration: 3000 });
        }
      });
    }
  }

  private redirectBasedOnRole(): void {
    const user = this.authService.currentUserValue;
    if (user?.role === 'admin') {
      this.router.navigate(['/admin']);
    } else if (user?.role === 'teacher') {
      this.router.navigate(['/teacher']);
    } else if (user?.role === 'student') {
      this.router.navigate(['/student']);
    } else {
      this.router.navigate(['/dashboard']);
    }
  }

  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }
}
