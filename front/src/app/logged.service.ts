import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface MeResponse {
  is_staff: boolean;
}
@Injectable({
  providedIn: 'root'
})
export class LoggedService {
  isLogged = signal(false);
  isStaff = signal(false);
 

  constructor(private http: HttpClient) { }

  userLogin(isStaff: boolean): void {
    this.isLogged.set(true);
    this.isStaff.set(isStaff);
  }

  userLogout(): void {
    this.isLogged.set(false);
  }

  checkLogin(): void {
    this.http.get<MeResponse>(
      '/api/me/',
      {withCredentials: true}
    ).subscribe({
      next: (user) => {
        this.isLogged.set(true);
        this.isStaff.set(user.is_staff)
        
      },
      error: () => {
        this.isLogged.set(false);
      }
    });
  }
  
}
