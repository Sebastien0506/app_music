import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

//On définit une interface pour récupérer les données envoyer par le back
export interface Music{
  id: number;
  title: string;
  duration: number;
  category: {
    id: number;
    name: string;
  } | null;
  size: number;
  file: string;
}

export interface DeleteMusic{
  success: string;
}
@Injectable({
  providedIn: 'root'
})
export class InfoMusicService {

  constructor(private http: HttpClient) { }

  //On récupère la musique
  getMusic(id: number): Observable<Music>{
    return this.http.get<Music>(`http://localhost:8000/api/get_one_music/${id}`,
      {
        withCredentials: true
      }
    );
  }

  
}
