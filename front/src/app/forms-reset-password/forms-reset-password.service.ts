import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

interface ResetResponse{
  message: string;
}
@Injectable({
  providedIn: 'root'
})
export class FormsResetPasswordService {

  constructor(private http: HttpClient) { }

  requestResetPassword(data: any): Observable<ResetResponse> {
    return this.http.post<ResetResponse>('http://localhost:8000/api/password_reset/', data, {
      withCredentials: true
    });
  }
}
