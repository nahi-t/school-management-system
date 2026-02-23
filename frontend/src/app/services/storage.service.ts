import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private readonly STORAGE_KEY = 'currentUser';

  constructor() {
    console.log('StorageService: Initializing storage service...');
  
    // Listen for storage changes across tabs
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', (event) => {
        console.log('StorageService: Storage event detected:', event.key, event.newValue);
        if (event.key === this.STORAGE_KEY && event.newValue) {
          console.log('StorageService: User data changed, reloading page...');
          window.location.reload();
        }
      });
    } else {
      console.log('StorageService: Window not available, using fallback');
    }
  }

  setUser(user: any): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(user));
      console.log('StorageService: User stored successfully:', user);
    } catch (error) {
      console.error('StorageService: Error storing user:', error);
    }
  }

  getUser(): any {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const user = JSON.parse(stored);
        console.log('StorageService: User retrieved successfully:', user);
        return user;
      }
      return null;
    } catch (error) {
      console.error('StorageService: Error retrieving user:', error);
      return null;
    }
  }

  removeUser(): void {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
      console.log('StorageService: User removed successfully');
    } catch (error) {
      console.error('StorageService: Error removing user:', error);
    }
  }
}
