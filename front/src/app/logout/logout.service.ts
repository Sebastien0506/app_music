import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface LogoutMessage {
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class LogoutService {

  constructor(private http: HttpClient) { }

  //On fait la requête vers le backend
  logoutUser(): Observable<LogoutMessage>{
    return this.http.post<LogoutMessage>('/api/logout/', null, {
      withCredentials: true
    })

  }
}
