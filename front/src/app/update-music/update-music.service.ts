import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

export interface Category{
  id: number;
  name: string;
  category: {
    id: number;
    name: string;
  }
}

export interface ResponseUpdateMusic {
  message: string;
}
@Injectable({
  providedIn: 'root'
})
export class UpdateMusicService {

  constructor(private http: HttpClient) { }

  //On fait la requête pour récuperer les catégories
  getCategory(): Observable<Category[]> {
    return this.http.get<Category[]> ('http://localhost:8000/api/get_all_category/', {
      withCredentials: true
    });
  }

  updateMusic(id: number, data: any): Observable<ResponseUpdateMusic>{
    return this.http.put<ResponseUpdateMusic>(`http://localhost:8000/api/update_music/${id}/`, data, {
      withCredentials: true,
      
    });
  }
}
