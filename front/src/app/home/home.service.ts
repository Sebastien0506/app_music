import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AvatarResponse {
  filename:string;
  file: string;
  size: number;
}

//On fait l'interface pour récupérer la description
export interface Description{
  description: string;
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

  get_description(): Observable<Description> {
    return this.http.get<Description>('/api/get_description/', {
      withCredentials: true
    });
  }
}
