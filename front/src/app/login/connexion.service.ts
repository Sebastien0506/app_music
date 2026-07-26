import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

//On créé une interface pour récuperer les données reçut
export interface LoginResponse {
  message: string;
  access_token: string;
}
@Injectable({
  providedIn: 'root'
})
export class ConnexionService {

  constructor(private http: HttpClient) { }

  //On crée la requête
  sendRequestLogin(data: any): Observable<LoginResponse> {
    return this.http.post<LoginResponse>('http://localhost:8000/api/login/', data, {
      withCredentials: true
    });
  }
}
