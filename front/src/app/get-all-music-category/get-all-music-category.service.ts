import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

//On crée l'interface pour recevoir les données
export interface GetAllMusicCategory{
  id: number;
  title: string;
  file: string;
  duration: number;
  size: number;
  category: string;
}
@Injectable({
  providedIn: 'root'
})
export class GetAllMusicCategoryService {

  constructor(private http: HttpClient) { }

  //On fait la requête
  getAllMusicCategory(id: number): Observable<GetAllMusicCategory[]>{
    return this.http.get<GetAllMusicCategory[]>(`api/get_all_music_category/${id}`,
      {
        withCredentials: true
      }
    );
  }
}
