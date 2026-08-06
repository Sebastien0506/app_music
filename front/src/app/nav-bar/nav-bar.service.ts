import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


interface LogoutMessage {
  message: string;
}

export interface Music {
  id: number,
  title: string,
  duration: number,
  size: number,
}
@Injectable({
  providedIn: 'root'
})
export class NavBarService {

  constructor(private http: HttpClient) { }

  //On fait la requête vers le backend
  logoutUser(): Observable<LogoutMessage>{
    return this.http.post<LogoutMessage>('http://localhost:8000/api/logout/', null, {
      withCredentials: true
    })

  }

  //On fait la requête vers le backend pour récupérer toutes les musiques et leur informations
  getAllMusic(): Observable<Music[]>{
    return this.http.get<Music[]>('http://localhost:8000/api/get_all_music/', {
      withCredentials:true
    });
  };

}
