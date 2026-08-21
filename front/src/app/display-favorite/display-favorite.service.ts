import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

//On crée l'interface pour recevoir les musiques favorites
export interface AllMusicFavorites{
  id: number;
  title: string;
  duration: number;
  size: number;
  file: string;
  category: {
    id: number;
    name: string;
  }[]
}

@Injectable({
  providedIn: 'root'
})
export class DisplayFavoriteService {

  constructor(private http: HttpClient) { }

  //On crée la requête pour demander toutes les musiques favorites de l'utilisateur
  getAllMusicFavorites(): Observable<AllMusicFavorites[]>{
    return this.http.get<AllMusicFavorites[]>('/api/get_all_music_favorites/', {
      withCredentials: true
    });
  }
  downloadMusic(id: number){
    return this.http.get(
      `/api/download_music/${id}/`,
      {
        responseType: 'blob',
        observe: 'response',
        withCredentials: true
      }
    );
  }
}
