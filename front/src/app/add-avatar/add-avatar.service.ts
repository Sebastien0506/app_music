import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

export interface ResponseAddAvatar {
  message: string;
}
@Injectable({
  providedIn: 'root'
})
export class AddAvatarService {

  constructor(private http: HttpClient) { }

  sendAvatar(formData: any): Observable<ResponseAddAvatar>{
    return this.http.post<ResponseAddAvatar>('/api/add_avatar/', formData, {
      withCredentials: true
    });
  }
}
