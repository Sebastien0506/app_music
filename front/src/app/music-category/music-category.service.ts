import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

//On crée l'interface pour recevoir les données
export interface MusicCategory{
  id: number;
  title: string;
  duration: number;
}
@Injectable({
  providedIn: 'root'
})
export class MusicCategoryService {

  constructor(private http: HttpClient) { }

  //On fait la requête pour récuperer les musiques
  getMusiccategory(id: number): Observable<MusicCategory[]>{
    return this.http.get<MusicCategory[]>(`http://localhost:8000/api/get_music_category/${id}`, {
      withCredentials: true
    });
  }
}
