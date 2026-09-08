import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AvatarResponse {
  filename:string;
  file: string;
  size: number;
}
@Injectable({
  providedIn: 'root'
})
export class HomeService {

  constructor(private http: HttpClient) { }

  //On fait la requête pour récupérer l'avatar du site
  get_avatar(): Observable<AvatarResponse>{
    return this.http.get<AvatarResponse>('/api/get_avatar/', {
      withCredentials: true
    });
  }
}
