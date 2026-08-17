import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface ResponseUpdateUser {
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserUpdateService {

  constructor(private http: HttpClient) { }

  sendRequestUpdateUser(data: any): Observable<ResponseUpdateUser>{
    return this.http.put<ResponseUpdateUser>('/api/update_user/', data, {
      withCredentials: true
    })
  }
}
