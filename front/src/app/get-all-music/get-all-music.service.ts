import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

//On crée l'interface pour recevoir les données
export interface AllMusic{
  id: number;
  title: string;
  duration: number;
  size: number;
  category: {
    id: number;
    name: string;
  }[]
  image_file: string | null;
  countLike: number;
  countDownload: number;
  isFavorites: boolean;
}

export interface DeleteMusicMessage{
  success: string;
}

export interface Message {
  error: string;
}
@Injectable({
  providedIn: 'root'
})
export class GetAllMusicService {

  constructor(private http: HttpClient) { }

  //on fait la requête pour demander toutes les musiques
  getAllMusic(): Observable<AllMusic[]>{
    return this.http.get<AllMusic[]>('/api/get_all_music/', {
      withCredentials: true
    });
  }

  removeMusic(id: number): Observable<DeleteMusicMessage>{
    return this.http.delete<DeleteMusicMessage>(`/api/delete_music/${id}/`, {
      withCredentials: true
    });
  }

  getMusicByLike(): Observable<AllMusic[]>{
    return this.http.get<AllMusic[]>('api/filter_music_by_like/', {
      withCredentials: true
    })
  };

  //On crée la requête pour récupérer les musiques par leur nombre de téléchargement
  getMusicByDownload(): Observable<AllMusic[]>{
    return this.http.get<AllMusic[]>('api/filter_music_by_download/', {
      withCredentials: true
    })
  };
}
