import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ResetPasswordService {

  constructor(private http: HttpClient) { }

  resetPassword(data: {token: string; password: string}){
    return this.http.post('http://localhost:8000/api/password_reset/confirm/', data, {
      withCredentials: true
    });
  };
}
