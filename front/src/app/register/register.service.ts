import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

//On crée une interface 
interface RegisterResponse {
  message: string;
  access_token: string;
}
@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  constructor(private http: HttpClient) { }

  requestRegister(data: any): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>('http://localhost:8000/api/register/', data, {
      withCredentials: true
    })
  }
}
