import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';



@Injectable({
  providedIn: 'root'
})


export class AuthServiceService {

  constructor(private http:HttpClient) { }
  //On fait la requête pour demander les données de l'utilisateur
  getCsrfToken(){
    return this.http.get('http://localhost:8000/get_csrf', {
      withCredentials: true
    });
  }

}
