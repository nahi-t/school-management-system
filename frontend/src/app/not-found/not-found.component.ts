import { Component } from '@angular/core';

@Component({
  selector: 'app-not-found',
  template: `
    <div class="container">
      <mat-card>
        <mat-card-content>
          <h1>404 - Page Not Found</h1>
          <p>The page you're looking for doesn't exist.</p>
          <button mat-raised-button color="primary" routerLink="/dashboard">
            Go to Dashboard
          </button>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .container {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 80vh;
      padding: 20px;
    }
    mat-card {
      max-width: 400px;
      text-align: center;
      padding: 20px;
    }
    h1 {
      color: #f44336;
      margin-bottom: 16px;
    }
  `]
})
export class NotFoundComponent {}
