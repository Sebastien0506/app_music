import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
export interface Category{
  id: number;
  name: string;
}

interface MusicCategory{
  id: number;
  title: string;
  duration: number;
  file: string;
}

//On fait l'interface pour la reponse lors de la suppression de la catégorie
export interface DeleteCategoryResponse{
  message: string;
}
@Injectable({
  providedIn: 'root'
})
export class GetCategoryService {

  constructor(private http: HttpClient) { }

  getCtegoryAll(): Observable<Category[]> {
    return this.http.get<Category[]>('/api/get_all_category/', {
      withCredentials: true
    })
  }

  getMusicCategory(category_id: number): Observable<MusicCategory[]>{
    return this.http.get<MusicCategory[]>(`/api/get_music_category/${category_id}`, {
      withCredentials: true
    });
  }

  //On fait la requête pour la suppression de la catégorie
  deleteCategory(id: number): Observable<DeleteCategoryResponse>{
    return this.http.delete<DeleteCategoryResponse>(`/api/delete_category/${id}/`, {
      withCredentials: true
    });
  }

  
}
