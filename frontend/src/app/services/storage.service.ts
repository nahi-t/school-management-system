import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private readonly STORAGE_KEY = 'currentUser';

  constructor() {
    // Listen for storage changes across tabs
    window.addEventListener('storage', (event) => {
      if (event.key === this.STORAGE_KEY) {
        window.location.reload();
      }
    });
  }

  setUser(user: any): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(user));
  }

  getUser(): any {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  }

  removeUser(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }
}
