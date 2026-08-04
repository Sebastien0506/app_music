import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

//On crée une interface pour la réponse
export interface User {
  id: number;
  username: string;
  last_name: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  // On fait la requête pour récupérer les informations de l'utilisateur
  sendRequestUser(): Observable<User>{
    return this.http.get<User>('http://localhost:8000/api/me', {
      withCredentials: true
    });
  };
}
