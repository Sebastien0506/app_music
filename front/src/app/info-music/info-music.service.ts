import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

//On définit une interface pour récupérer les données envoyer par le back
export interface Music{
  id: number;
  title: string;
  duration: number;
  category: string | null;
  size: number;
  file: string;
}

export interface DeleteMusic{
  success: string;
}

export interface AddfavoriteMusicResponse{
  message: string;
}
@Injectable({
  providedIn: 'root'
})
export class InfoMusicService {

  constructor(private http: HttpClient) { }

  //On récupère la musique
  getMusic(id: number): Observable<Music>{
    return this.http.get<Music>(`/api/get_one_music/${id}`,
      {
        withCredentials: true
      }
    );
  }

  //On envoi la requête pour ajouter la musique au favori
  addMusicFavorite(id: number): Observable<AddfavoriteMusicResponse>{
    return this.http.post<AddfavoriteMusicResponse>(`/api/add_favorite_music/${id}/`, null, {
      withCredentials: true
    });
  }

  
}
