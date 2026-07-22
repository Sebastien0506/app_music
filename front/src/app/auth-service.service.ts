import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

interface User {
  name: string
  last_name: string
}

@Injectable({
  providedIn: 'root'
})


export class AuthServiceService {

  constructor(private http:HttpClient) { }
  //On fait la requête pour demander les données de l'utilisateur
  getUser(): Observable<User[]> {
    return this.http.get<User[]>('http://localhost:8000/me/', {withCredentials: true})
  }

}
