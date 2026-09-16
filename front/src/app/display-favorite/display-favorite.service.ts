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

//On crée l'interface pour mettre la reponse lors de la suppression de la musique des favoris
export interface DeleteMusicFavoritesResponse{
  success?: string;
  error?: string;
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

  //On crée la requête pour supprimer la musique des favorites
  deleteMusicFavorites(id: number): Observable<DeleteMusicFavoritesResponse> {
    return this.http.delete<DeleteMusicFavoritesResponse>(`/api/delete_music_favorites/${id}/`, {
      withCredentials: true
    });
  }
}
