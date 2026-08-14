import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

//On crée l'interface pour recevoir les données
export interface AllMusic{
  id: number;
  title: string;
  duration: number;
  size: number;
  category: string | null;
}
@Injectable({
  providedIn: 'root'
})
export class GetAllMusicService {

  constructor(private http: HttpClient) { }

  //on fait la requête pour demander toutes les musiques
  getAllMusic(): Observable<AllMusic[]>{
    return this.http.get<AllMusic[]>('http://localhost:8000/api/get_all_music/', {
      withCredentials: true
    });
  }
}
