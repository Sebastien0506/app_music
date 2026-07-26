import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LoggedService {
  isLogged = signal(false);

  constructor(private http: HttpClient) { }

  userLogin(): void {
    this.isLogged.set(true);
  }

  userLogout(): void {
    this.isLogged.set(false);
  }

  checkLogin(): void {
    this.http.get(
      'http://localhost:8000/api/me/',
      {withCredentials: true}
    ).subscribe({
      next: () => {
        this.isLogged.set(true);
      },
      error: () => {
        this.isLogged.set(false);
      }
    });
  }
  
}
